const express =require('express')
const authRouter = express.Router()

const authController = require('../controllers/authController')

authRouter.post('/register',authController.signupPost)
authRouter.post('/login',authController.loginPost)
authRouter.post('/resetPassword',authController.resetpassword)
authRouter.post('/updatepassword',authController.updatepassword)


module.exports = authRouter