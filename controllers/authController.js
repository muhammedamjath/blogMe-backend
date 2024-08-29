const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const clientSignupSchema = require("../model/signup");

// rejex
const emailRejex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRejex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// signup post
exports.signupPost = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await clientSignupSchema.findOne({ email: email });
  if (!user) {
    const hashPas = await bcrypt.hash(password, 10);

    let userSignup = new clientSignupSchema({
      name: name,
      email: email,
      password: hashPas,
      category: "user",
    });

    if (userSignup) {
      if (!passwordRejex.test(password) || !emailRejex.test(email)) {
        res.status(200).json("incorrect email or password");
      } else {
        await userSignup.save();
        res.status(200).json("account created successfully");
      }
    }
  } else {
    res.status(200).json("this email is already exist");
  }
};

// login post
exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await clientSignupSchema.findOne({ email: email });

  if (user) {
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      const id = { id: user._id };
      const token = jwt.sign(id, process.env.JWT_TOCKEN_SECERT);
      res.status(200).json({
        status: "success",
        data: {
          id: user._id,
          email: user.email,
        },
        token: token,
      });
    } else {
      res.status(200).json({ status: "incorrect password" });
    }
  } else {
    res.status(200).json({ status: "userData not fount" });
  }
};

// reset password
exports.resetpassword = async (req, res) => {
  const { email } = req.body;
  const user = await clientSignupSchema.findOne({ email: email });
  try {
    if (user) {
      res.status(200).json("email verified");
    } else {
      res.status(200).json("email not verified");
    }
  } catch (err) {
    console.log(err);
  }
};

// update password
exports.updatepassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!passwordRejex.test(newPassword)) {
      res.status(200).json("invalid password");
    } else {
      const hashPas = await bcrypt.hash(newPassword, 10);
      const updatePass = await clientSignupSchema.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hashPas,
          },
        },
        { new: true }
      );
      res.status(200).json("password updated");
    }
  } catch (err) {
    console.log(err);
  }
};
