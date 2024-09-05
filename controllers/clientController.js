const blogCollection = require("../model/blogPost");

// blog post
exports.blogPost = async (req, res) => {
  const { title, description, sceduleDate, sceduleTime , submitType  } = req.body;
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
    }else if (submitType == 'draft'){
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
              createdAt:0,
              category:0
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
