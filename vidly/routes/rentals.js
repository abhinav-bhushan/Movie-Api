const mongoose=require('mongoose')
const express=require("express")
const router=express.Router()
const { Customer}=require("../models/customer")
const { Movie}=require("../models/movie")
const auth=require("../middleware/auth")
const {Rental,validate}=require("../models/rental")


//define routes
router.get('/',async(req,res)=>{
    const rentals=await Rental.find().sort("-dateOut")
    res.send(rentals)
})

router.get('/:id',async(req,res)=>{
    const rental= await Rental.findById({_id:mongoose.Types.ObjectId(req.params.id)})
    if(!rental)
        return res.status(400).send("The rental with given ID is not available in the database")
    
    res.send(rental)

})

router.post('/',auth,async(req,res)=>{
    const {error}=validate(req.body)
    if(error)
        return res.status(400).send(error.details[0].message)
    //Find the Customer
    const customer=await Customer.findById({_id:req.body.customerId})
    if(!customer) return res.status(400).send("Customer Id not found")

    //Find the Movie
    let movie=await Movie.findById({_id:req.body.movieId})
    if(!movie) return res.status(400).send("Movie Id not found")

    //Make sure movie is in stock
    if(movie.numberInStock===0) return res.status(400).send("Movie not in stock")
    
    //new Rental
    let rental =new Rental(
        {
           customer:{
                _id:customer._id,
                name:customer.name,
                phone:customer.phone
            },
            movie:{
                _id:movie._id,
                title:movie.title,
                dailyRentalRate:movie.dailyRentalRate
            }
        }
    )
    rental=await rental.save()
    movie.numberInStock--
    movie=await movie.save()
    res.send(rental)

})

module.exports=router
