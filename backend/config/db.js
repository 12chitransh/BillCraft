import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
};

export default connectDB;