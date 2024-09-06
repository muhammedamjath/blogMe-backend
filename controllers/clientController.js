const { default: mongoose } = require("mongoose");
const blogCollection = require("../model/blogPost");

// blog post
exports.blogPost = async (req, res) => {
  const { title, description, sceduleDate, sceduleTime, submitType } = req.body;
  const file = req.file.path;

  const userId = req.user.id;

  try {
    let createBlog;
    if (sceduleDate && sceduleTime) {
      createBlog = new blogCollection({
        title: title,
        description: description,
        sceduleDate: sceduleDate,
        sceduleTime: sceduleTime,
        userId: userId,
        image: file,
        type: "sceduled",
      });
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
