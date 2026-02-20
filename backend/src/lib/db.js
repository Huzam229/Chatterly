import mongoos from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoos.connect(process.env.MONGO_URI);
    console.log(`MongoDN connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connection to MongoDB", error);
    process.exit(1);
  }
};
