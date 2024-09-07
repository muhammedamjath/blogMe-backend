const { default: mongoose } = require("mongoose");
const blogCollection = require("../model/blogPost");
const cron = require("node-cron");

// cron job map setting
const cronJobs = new Map();

// blog post
exports.blogPost = async (req, res) => {
  const { title, description, sceduleDate, scheduleTime, submitType } =
    req.body;
  const file = req.file.path;

  const userId = req.user.id;

  try {
    let createBlog;
    if (sceduleDate && scheduleTime) {
      createBlog = new blogCollection({
        title: title,
        description: description,
        userId: userId,
        sceduleDate: sceduleDate,
        sceduleTime: scheduleTime,
        image: file,
        type: "scheduled",
      });

      const scheduledDateTime = new Date(`${sceduleDate}T${scheduleTime}`);
      const cronTime = `${scheduledDateTime.getMinutes()} ${scheduledDateTime.getHours()} ${scheduledDateTime.getDate()} ${
        scheduledDateTime.getMonth() + 1
      } *`;

      const scheduledCronJob = cron.schedule(
        cronTime,
        async () => {
          await blogCollection.findOneAndUpdate(
            { _id: createBlog._id },
            {
              $set: { type: "posted" },
            }
          );
        },
        {
          scheduled: true,
          timezone: "Asia/Kolkata",
        }
      );
      cronJobs.set(createBlog._id.toString(), scheduledCronJob);
    } else if (submitType == "draft") {
      createBlog = new blogCollection({
        title: title,
        description: description,
        userId: userId,
        image: file,
        type: "draft",
      });
    } else {
      createBlog = new blogCollection({
        title: title,
        description: description,
        userId: userId,
        image: file,
        type: "posted",
      });
    }

    if (createBlog) {
      await createBlog.save();
      res.status(200).json("blog created");
    } else {
      res.status(200).json("blog not created");
    }
  } catch (err) {
    console.log(err);
  }
};

// full blog get
exports.fullBlogGet = async (req, res) => {
  const blogs = await blogCollection.aggregate([
    {
      $match: {
        type: "posted",
      },
    },
    {
      $lookup: {
        from: "clientsignups",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
        pipeline: [
          {
            $project: {
              password: 0,
              createdAt: 0,
              category: 0,
            },
          },
        ],
      },
    },
  ]);
  if (blogs) {
    res.status(200).json(blogs);
  } else {
    res.status(401).json({ message: "requst again" });
  }
};

// get drafted blogs
exports.drafetdBlogs = async (req, res) => {
  const userId = req.user.id;
  const blogs = await blogCollection.find({
    userId: new mongoose.Types.ObjectId(userId),
    type: "draft",
  });
  if (blogs) {
    res.status(200).json(blogs);
  } else {
    res.status(401).json({ message: "requst again" });
  }
};

// posted blogs get
exports.postedBlogs = async (req, res) => {
  const userId = req.user.id;
  const blogs = await blogCollection.find({
    userId: new mongoose.Types.ObjectId(userId),
    type: "posted",
  });
  if (blogs) {
    res.status(200).json(blogs);
  } else {
    res.status(401).json({ message: "requst again" });
  }
};

// scheduled
exports.scheduledBlogs = async (req, res) => {
  const userId = req.user.id;
  const blogs = await blogCollection.find({
    userId: new mongoose.Types.ObjectId(userId),
    type: "scheduled",
  });
  if (blogs) {
    res.status(200).json(blogs);
  } else {
    res.status(401).json({ message: "requst again" });
  }
};

// get single blog
exports.getsingleBlog = async (req, res) => {
  const blogId = req.params.id;

  const blog = await blogCollection.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: "clientsignups",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
        pipeline: [
          {
            $project: {
              password: 0,
              createdAt: 0,
              category: 0,
            },
          },
        ],
      },
    },
  ]);
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(401).json({ message: "requst again" });
  }
};

// delete blog
exports.deleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    if (id) {
      const deleteBlog = await blogCollection.findOneAndDelete({ _id: id });
      if (deleteBlog) {
        res.status(200).json("deleted");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).json();
  }
};

// reschedule time for blog posting
exports.reschedule = async (req, res) => {
  const { blogId, newDateTime } = req.body;
  try {

    const updateDateTime = await blogCollection.findOneAndUpdate(
      {_id:new mongoose.Types.ObjectId(blogId)},
      {
        $set:{
          sceduleDate: newDateTime.newDate,
          sceduleTime: newDateTime.newTime,
        }
      }
    )
    if(updateDateTime){
      res.status(200).json('date and time rescheduled')
    }


    if (cronJobs.has(blogId)) {
      const oldCronJob = cronJobs.get(blogId);
      oldCronJob.stop();
      cronJobs.delete(blogId);
    }
    const scheduledDateTime = new Date(
      `${newDateTime.newDate}T${newDateTime.newTime}`
    );
    const cronTime = `${scheduledDateTime.getMinutes()} ${scheduledDateTime.getHours()} ${scheduledDateTime.getDate()} ${
      scheduledDateTime.getMonth() + 1
    } *`;

    cron.schedule(
      cronTime,
      async () => {
        await blogCollection.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(blogId) },
          {
            $set: {
              type: "posted",
              createdAt:Date.now()
            },
          }
        );
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );
  } catch (err) {
    console.log(err);
  }
};
