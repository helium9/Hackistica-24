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
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};
// Import the MongoDB Node.js driver


// Connection URI for your MongoDB Atlas cluster
const uri = process.env.MONGO_DB_URI;

// Function to add data to the database
async function addData(data) {
  // Create a new MongoClient
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database and collection
    const database = client.db('your_database_name');
    const collection = database.collection('your_collection_name');

    // Insert the data
    const result = await collection.insertOne(data);
    console.log(`Inserted ${result.insertedCount} document`);

  } finally {
    // Close the client
    await client.close();
  }
}

// Example data to insert
const newData = { name: 'John Doe', age: 30, email: 'john@example.com' };

// Call the function to add the data
addData(newData)
  .then(() => console.log('Data added successfully'))
  .catch(error => console.error('Error adding data:', error));

export async function POST(req, {params}) {
  try {
    const content = await req.json();
    
    // Check if MongoDB URI is configured
    if (!process.env.MONGO_DB_URI) {
      console.log("MongoDB URI not configured, skipping test");
      return Response.json({ status: "skipped", message: "Database not configured", data: content });
    }
    
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      console.log("Test12 API - Received content:", content);
      
      const database = client.db('Edit_X');
      const collection = database.collection('test');

      const result = await collection.insertOne({name: "ki", timestamp: new Date()});
      console.log(`Inserted ${result.insertedCount} document`);
      
      return Response.json({status: "ok", data: content});
      
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error in test12 API:", error);
    return Response.json({ status: "error", message: error.message }, { status: 500 });
  }
}