import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {autoIndex: true});
        console.log("MongoDB Connected");
    } catch (err) { 
        console.error("Connection error", err);
    }
}

export default connectDB;