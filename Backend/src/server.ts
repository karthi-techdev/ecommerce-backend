import app from "./app";
import { ENV } from "./config/env";
import dbConnection from "./config/database";

const startServer = async () => {
  try {
    // Connect to database
    await dbConnection.connect();

    const PORT = ENV.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();