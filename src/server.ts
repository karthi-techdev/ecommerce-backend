import app from "./app";
import mongoose from "mongoose";
import { ENV } from "./config/env";

const PORT = ENV.PORT || 8000; 
const mongoUri = ENV.MONGO_URI || "mongodb://localhost:27017/ecommerce";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected to:", mongoUri))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 