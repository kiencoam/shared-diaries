import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "shared-diaries",
    });

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
  }
};
