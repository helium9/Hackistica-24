const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({path: ".env"})

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to mongo db database ${mongoose.connection.host}`)

    }catch(error){
        console.log("Mongodb connection ",{error})
    }
}

module.exports = connectDB;