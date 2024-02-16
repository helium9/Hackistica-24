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
    // users:[
    //     {
    //         type:String,
    //         required:[true,"Users us required"],
    //     }
    // ],
    users:[
        {
            type:String,
            required:[true,"Users us required"],
        }
    ],
    content:{
        type:String,
        required:[true,"content is required"]
    }
},{timestamps:true});

const documentModel = mongoose.model('Document',Document);

module.exports = documentModel;