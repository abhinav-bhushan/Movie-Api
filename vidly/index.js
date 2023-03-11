require("express-async-errors")
const mongoose = require('mongoose');
const config=require("config")
const genres = require('./routes/genres');
const customers=require('./routes/customers')
const movies=require("./routes/movies")
const rentals=require("./routes/rentals")
const users=require("./routes/users")
const auth=require("./routes/auth")
const express = require('express');
const error=require("./middleware/error")
const Joi=require("joi")

const app = express();

if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR : jwtPrivateKey is not defined '),
    process.exit(1);
};

mongoose.connect('mongodb://127.0.0.1:27017/vidly')
    .then(()=>console.log("Connected to MongoDB"))
    .catch(err=>console.log("Could not connect to MongoDB",err))


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers',customers)
app.use('/api/movies',movies)
app.use('/api/rentals',rentals)
app.use("/api/users",users)
app.use("/api/auth",auth)
app.use(error)


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


