const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const clientSignupSchema = require("../model/signup");


// rejex
const emailRejex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRejex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// signup post
exports.signupPost = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const user = await clientSignupSchema.findOne({email:email})
  if(!user){
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
      } else  {
        await userSignup.save();
        res.status(200).json('account created successfully')
      }
    }
  }else{
    res.status(200).json('this email is already exist')
  }
};

// login post
exports.loginPost = async (req, res) => {
  console.log(req.body);
  
  const { email, password } = req.body;
  const user = await clientSignupSchema.findOne({ email: email });

  if (user) {
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      const id = { id: user._id };
      const token = jwt.sign(id, process.env.JWT_TOCKEN_SECERT);
      res.status(200).json({
        status:'success',
        data: {
          id: user._id,
          email: user.email,
        },
        token: token,
      });
    } else {
      res.status(200).json({status:'incorrect password'});
    }
  } else {
    res.status(200).json({status:'userData not fount'});
  }
};

// reset password
exports.resetpass = async (res,rtes)=>{
  
}

 

