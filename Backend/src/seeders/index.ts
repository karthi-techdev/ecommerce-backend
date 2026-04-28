import mongoose from "mongoose";
import { ENV } from "../config/env";
import seedFaqs from "./faqSeeder";
import seedOrders from "./orderSeeder";
import seedNews from "./newsletter";
import inquirer from "inquirer"

const seedAll = async (): Promise<void> => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(ENV.MONGO_URI);

    console.log("Connected to MongoDB");

    

    const answer = await inquirer.prompt([
      {
         type:"list",
         name: "seeder",
         message: "Select which data to seed:",
         choices: [
          {name:"FAQ Seed", value: "FAQ"},
          {name:"Order Seed", value:"Order"},
          {name:"Newsletter seed", value:"Newsletter"},
          {name:"All Seed" , value:"All"}
         ],
      },
    ]);
     switch (answer.seeder) {
      case "FAQ":
        await seedFaqs();
        console.log("FAQ seeded");
        break;

      case "Order":
        await seedOrders();
        console.log("Orders seeded");
        break;

      case "Newsletter":
        await seedNews();
        console.log("Newsletter seeded");
        break;

      case "All":
        await seedFaqs();
        await seedOrders();
        await seedNews();
        console.log("All seeded");
        break;
    }

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