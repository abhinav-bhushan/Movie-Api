const mongoose=require('mongoose')
const config=require('config')
const express=require("express")
const jwt=require('jsonwebtoken')
const Joi=require("joi")
const router=express.Router()
const bcrypt=require("bcrypt")
const { User}=require("../models/user")

//define routes
router.post('/',async(req,res)=>{
    const {error}=validate(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)
    
    //check if user already exists
    let user=await User.findOne({email:req.body.email})
    if (!user)
        return res.status(400).send("Invalid User or Password")
    const validPassword=await bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send("Invalid User or Password")
    const token=user.generateAuthToken()
    res.send(token)
})

function validate(req)
{
    const schema={
        password:Joi.string().min(5).max(255).required(),
        email:Joi.string().min(5).max(255).required().email()

    }
    return Joi.validate(req,schema)
}



module.exports=router
