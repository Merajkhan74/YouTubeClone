import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import cookieParser from cookie-Parser


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    
}))
app.use(express.json({limit: "15k"}))

app.use(express.urlencoded({extended:true , limit: "15k"}))

app.use(express.static("public "))
app.use(cookieParser())

export default app;

