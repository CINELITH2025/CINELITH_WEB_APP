import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/config/db.js";

// Ensure MongoDB Atlas connection for serverless execution
connectDB();

export default app;
