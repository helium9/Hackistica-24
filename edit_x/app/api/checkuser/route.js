import mongoose from "mongoose";
require("dotenv").config();
import bodyParser from "body-parser";
const { MongoClient } = require("mongodb");
// Parse JSON bodies for this API
export const config = {
  api: {
    bodyParser: true,
  },
};
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

export async function POST(req, { params }) {
  try {
    const content = await req.json();

    // Check if MongoDB URI is configured
    if (!process.env.MONGO_DB_URI) {
      console.log("MongoDB URI not configured, skipping database check");
      return Response.json({
        status: "skipped",
        message: "Database not configured",
      });
    }

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("Edit_X");
      const collection = database.collection("test");

      const r = await collection.findOne({ email: content.email });

      if (!r) {
        const ins = await collection.insertOne({ email: content.email });
        console.log(`Inserted document for user: ${content.email}`);
      } else {
        console.log("User already exists");
      }

      return Response.json({ status: "ok", message: "User checked" });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error in checkuser API:", error);
    return Response.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
