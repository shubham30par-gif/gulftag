import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    return await mongoose.connect(process.env.DB_URI as string, {
      dbName: "gulflasertag",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
  }
};
