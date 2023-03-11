const mongoose=require('mongoose')
const express=require("express")
const router=express.Router()
const auth=require("../middleware/auth")
const { Customer,validate}=require("../models/customer")

//define routes
router.get('/',async(req,res)=>{
    const customers=await Customer.find().sort('name')
    res.send(customers)
})

router.get('/:id',async(req,res)=>{
    const customer= await Customer.findById({_id:mongoose.Types.ObjectId(req.params.id)})
    if(!customer)
        return res.status(400).send("The customer with given ID is not available in the database")
    
    res.send(customer)

})

router.post('/',auth,async(req,res)=>{
    const {error}=validate(req.body)
    if(error)
        res.status(400).send(error.details[0].message)
    
    let customer=new Customer(
        {
            name:req.body.name,
            isGold:req.body.isGold,
            phone:req.body.phone
        }
    )
    customer=await customer.save()
    res.send(customer)
})
~
router.put('/:id',auth,async(req,res)=>{
    const {error}=validate(req.body)
    if(error)
        res.status(400).send(error.details[0])
    
    const customer=await Customer.findByIdAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},{
        $set:{
            name:req.body.name,
            isGold:req.body.isGold,
            phone:req.body.phone
        }
    },{new:true})

    if(!customer)
        return res.status(404).send("The genre with given Id doesn't exist")
    res.send(customer)
})

router.delete('/:id',auth,async(req,res)=>{
    const customer=await Customer.findByIdAndRemove({_id:mongoose.Types.ObjectId(req.params.id)})
    if(!customer)
        return res.status(404).send("The genre with given Id doesn't exist")
    res.send(customer)

})

module.exports=router
