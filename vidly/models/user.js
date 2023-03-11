const auth=require("../middleware/auth")
const mongoose=require("mongoose")
const Joi=require("joi")
const jwt=require('jsonwebtoken')
const config=require('config')


const userSchema=new mongoose.Schema({
    name:{type:String,minlength:5,maxlength:50,required:true},
    password:{type:String,minlength:5,maxlength:1024,required:true},
    email:{type:String,minlength:5,maxlength:255,unqiue:true,required:true},
    isAdmin:Boolean
    })

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get("jwtPrivateKey"))
    return token
}
const User=mongoose.model("User",userSchema)

function userValidate(user)
{
    const schema={
        name:Joi.string().min(5).max(50).required(),
        password:Joi.string().min(5).max(255).required(),
        email:Joi.string().min(5).max(255).required().email()

    }
    return Joi.validate(user,schema)
}

exports.User=User
exports.validate=userValidate
