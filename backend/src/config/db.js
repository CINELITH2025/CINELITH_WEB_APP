import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB connection failed:", err.message);
    console.error("ℹ️ Server will continue running on port 5050, but database operations require valid MONGO_URI credentials.");
  }
};
