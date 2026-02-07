import mongoose from 'mongoose';
import {DB_URI} from '../config/env.js';

export const connectDB = async () => {
    try{
        await mongoose.connect(DB_URI);
        console.log("MongoDB connection successful");
    }catch(e){
        console.log("MongoDB connection error: " + e);
        process.exit(1);
    }
}