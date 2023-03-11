const mongoose=require('mongoose')
const express=require("express")
const router=express.Router()
const { Movie,validate}=require("../models/movie")
const auth=require("../middleware/auth")
const {Genre}=require("../models/genre")

//define routes
router.get('/',async(req,res)=>{
    const movies=await Movie.find().sort('name')
    res.send(movies)
})

router.get('/:id',async(req,res)=>{
    const movie= await Movie.findById({_id:mongoose.Types.ObjectId(req.params.id)})
    if(!movie)
        return res.status(400).send("The movie with given ID is not available in the database")
    
    res.send(movie)

})

router.post('/',auth,async(req,res)=>{
    const {error}=validate(req.body)
    if(error)
        res.status(400).send(error.details[0].message)
    //Find the Genre
    const genre=await Genre.findById({_id:req.body.genreId})
    if(!genre) return res.status(404).send("Genre Id not found")
    
    //new Movie
    const movie=new Movie(
        {
            title:req.body.title,
            dailyRentalRate:req.body.dailyRentalRate,
            numberInStock:req.body.numberInStock,
            genre:{
              _id:genre._id,
              name:genre.name
            }
        }
    )
    await movie.save()
    res.send(movie)
})
~
router.put('/:id',auth,async(req,res)=>{
    const {error}=validate(req.body)
    if(error)
        res.status(400).send(error.details[0])

    const genre=Genre.findById({_id:req.body.genreId})
    if(!genre)
        return res.status(404).send("The Genre Id doesn't exist")

    const movie=await Movie.findByIdAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},{
        $set:{
            title:req.body.title,
            dailyRentalRate:req.body.dailyRentalRate,
            numberInStock:req.body.numberInStock,
            genre:{
              _id:genre._id,
              name:genre.name
            }
        }
    },{new:true})

    if(!movie)
        return res.status(404).send("The movie with given Id doesn't exist")
    res.send(movie)
})

router.delete('/:id',auth,async(req,res)=>{
    const movie=await Movie.findByIdAndRemove({_id:mongoose.Types.ObjectId(req.params.id)})
    if(!movie)
        return res.status(404).send("The movie with given Id doesn't exist")
    res.send(movie)

})

module.exports=router
