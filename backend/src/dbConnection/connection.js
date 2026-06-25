import mongoose from "mongoose";

export const dbConnect = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to database");
  }
  catch(err){
    console.error("Database connection error:", err);
    process.exit(1);
  }
};