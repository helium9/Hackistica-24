const mongoose = require("mongoose");
const { type } = require("os");

const Document = new mongoose.Schema({
    // title:{
    //     type:String,
    //     require:[true,'title is requried']
    // },
    roomId:{
        type:String,
        require:[true,"roomId is requried"]
    },
    content:[{
        type:String,
    }]
},{timestamps:true});

const documentModel = mongoose.model('Document',Document);

module.exports = documentModel;