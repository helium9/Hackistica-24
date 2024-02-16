const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username:{
        type: String,
        require: [true,"Must provide a username"],
        unique: [true,"Must be unique"]
    },
    email: {
        type: String,
        require: [true,"Must provide a equal"],
        unique: [true,"Must be unique"]
    },
    password:{
        type: String,
        require: [true,"Must provide a password"],
        
    },
},{
    timestamps:true
});
console.log("jelllocasd")
const userModel = mongoose.models.User || mongoose.model('User',User);

module.exports = userModel;