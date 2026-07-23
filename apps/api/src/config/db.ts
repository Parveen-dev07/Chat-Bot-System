import mongoose from "mongoose";

export const ConnectDb = async () => {
  try {
    const mongoUri =
      process.env.DOCKER === "true"
        ? process.env.DOCKER_MONGODB_URI
        : process.env.MONGODB_URI;

    console.log("DOCKER:", process.env.DOCKER);
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    console.log("DOCKER_MONGODB_URI:", process.env.DOCKER_MONGODB_URI);
    console.log("SELECTED MONGO URI:", mongoUri);

    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined");
    }

    await mongoose.connect(mongoUri);

    console.log("DB connection successfully");
  } catch (error: any) {
    console.log("DB connection failed");
    console.log("DB error:", error.message);

    process.exit(1);
  }
};