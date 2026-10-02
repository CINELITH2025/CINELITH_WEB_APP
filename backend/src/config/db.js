import mongoose from "mongoose";

let cachedPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("⚠️ MONGO_URI is not defined in environment variables");
      return null;
    }

    cachedPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error("⚠️ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  try {
    return await cachedPromise;
  } catch (err) {
    cachedPromise = null;
    return null;
  }
};
