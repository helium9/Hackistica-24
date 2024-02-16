const connectDB = require("../../../config/db.js");
// import connectDB from "../../../config/db.js";
import userModel from "../../../models/userModel.js";
import { NextResponse } from "@/node_modules/next/server";
import bcrypt from "bcrypt";

export async function POST(req){
    try{
        await connectDB();
        let {username,email,password} = await req.json();
        console.log('11',{username,email,password});
        // const existingUser = userModel.findOne({email});
        // console.log('----------------------------------------')
        // console.log(Boolean(existingUser))
        // console.log(existingUser);
        // if(existingUser){
        //     console.log("Hello")
        //     return NextResponse.json({message: "Username or email already exists."},{status: 500})
            
        // }
        
        console.log("Hash")
        password = await bcrypt.hash(password,10);
        // console.log(hashedPassword); 
        console.log('create')
        await userModel.create({username,email,password});
        console.log("save")
        return NextResponse.json({message:"User registered."},{status:201});
    }catch(error){
        console.log("Error while registering user",error);
        return NextResponse.json({message: "Error occured while registering the user"},{status:500});
    }
}