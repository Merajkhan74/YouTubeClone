import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{ 
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL} `);
        console.log(`\n Connected to DataBase : DB Host ${connectionInstance.connection.host} \n`);
    } catch (error) {
        console.log("Error while connecting Fail ", error);
        process.exit(1);
    }

}
export default connectDB;