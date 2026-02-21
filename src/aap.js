// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// // import cookieParser from cookie-Parser


// const app = express();

// app.use(cors({
//     origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//      credentials: true
    
// }))
// app.use(express.json({limit: "15k"}))

// app.use(express.urlencoded({extended:true , limit: "15k"}))
// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true, limit: "1mb" }));


// app.use(express.static("public"))
// app.use(cookieParser())


// // router import 
// import userRouter  from './routes/user.routes.js'

// //router declaration 
// app.use('/api/v2/users', userRouter)

// export default app;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// ✅ body size limit (ek hi baar)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(express.static("public"));
app.use(cookieParser());

// router
import userRouter from './routes/user.routes.js';
app.use('/api/v2/users', userRouter);

export default app;
