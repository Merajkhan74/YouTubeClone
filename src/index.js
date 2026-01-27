
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./aap.js";
dotenv.config({
    path: './.env'
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(` Server is running on PORT : ${process.env.PORT || 8000}`);
    })
})
.catch((err) => {
    console.log(" DB Connection fail Index", err);
})