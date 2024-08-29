const mongoose=require('mongoose')

const clientSignup=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const clientSignupCollection=new mongoose.model('clientSignup',clientSignup)

module.exports=clientSignupCollection