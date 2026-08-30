
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

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "YouTube Backend API is running"
    });
});
import userRouter from './routes/user.routes.js';
app.use('/api/v2/users', userRouter);

//routes declaration
// app.use("/api/v2/healthcheck", healthcheckRouter)
// app.use("/api/v2/users", userRouter)
// app.use("/api/v2/tweets", tweetRouter)
// app.use("/api/v2/subscriptions", subscriptionRouter)
// app.use("/api/v2/videos", videoRouter)
// app.use("/api/v2/comments", commentRouter)
// app.use("/api/v2/likes", likeRouter)
// app.use("/api/v2/playlist", playlistRouter)
// app.use("/api/v2/dashboard", dashboardRouter)


// // app.use("/api/v2/healthcheck", healthcheckRouter)
// app.use("/api/v2/users", userRouter)
// app.use("/api/v2/tweets", tweetRouter)
// app.use("/api/v2/subscriptions", subscriptionRouter)
// app.use("/api/v2/videos", videoRouter)
// app.use("/api/v2/comments", commentRouter)
// app.use("/api/v2/likes", likeRouter)
// app.use("/api/v2/playlist", playlistRouter)
// app.use("/api/v2/dashboard", dashboardRouter)

export default app;
