import app from "./app";
import mongoose from "mongoose";
import { ENV } from "./config/env";


const mongoUri = ENV.MONGO_URI || "mongodb://localhost:27017/bookadzone";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected to:", mongoUri))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = ENV.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});