import mongoose from "mongoose";
require('dotenv').config();
import bodyParser from 'body-parser';
const { MongoClient } = require('mongodb');
// Parse JSON bodies for this API
export const config = {
    api: {
        bodyParser: true,
    },
}
const connectMongoDB = async () => {
  try {
    console.log(process.env.MONGO_DB_URI);
    await mongoose.connect(process.env.MONGO_DB_URI);
    // console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};

const uri = process.env.MONGO_DB_URI;


// pages/api/postData.js


  

export async function POST(req,{params}) {
 
  const content=await req.json();
  const client = new MongoClient(uri);
  try {
  await client.connect();
  const database = client.db('Edit_X');
  const collection = database.collection('test');

  const r = await collection.findOne({"user":content.email});
  if(!r){
    const ins = await collection.insertOne({email:content.email});
    console.log(`Inserted ${result.insertedCount} document`);

  }
  else{

    // console.log("user already exist")

  }
 


  } finally {
    // Close the client
    await client.close();
  }
  

    // connectMongoDB();

   
    return Response.json({"Connection":"ok"});
  }