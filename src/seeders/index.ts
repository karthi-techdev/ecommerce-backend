import mongoose from "mongoose";
import { ENV } from "../config/env";
import seedFaqs from "./faqSeeder";


const seedAll = async (): Promise<void> => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(ENV.MONGO_URI);

    console.log("Connected to MongoDB");
    await seedFaqs();
    console.log("All seeders executed successfully");
    await mongoose.connection.close();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Seeding failed:", error.message);
    } else {
      console.error("Seeding failed:", error);
    }
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAll();