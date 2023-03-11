const auth=require("../middleware/auth")
const mongoose=require('mongoose')
const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const _=require("lodash")
const config=require('config')
const jwt=require('jsonwebtoken')
const { User,validate}=require("../models/user")

router.get("/me",auth,async(req,res)=>{
    const user=await User.findById(req.user._id).select({password:0})
    res.send(user)
})

//define routes
router.post('/',async(req,res)=>{
    const {error}=validate(req.body)
    if (error)
        res.status(400).send(error.details[0].message)
    
    //check if user already exists
    let user=await User.findOne({email:req.body.email})
    if (user)
        return res.status(400).send("User already exists")
    user=new User(_.pick(req.body,["name","password","email"]))
    const salt=await bcrypt.genSalt(10)
    user.password=await bcrypt.hash(user.password,salt)
    await user.save()
    const token=user.generateAuthToken()
    res.header('x-auth-token',token).send(_.pick(user,["_id","name","email"]))

})



module.exports=router
