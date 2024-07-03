import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

dotenv.config({
    path: ".env"
});
databaseConnection();
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    origin: ["https://twitter-clone-sushil.vercel.app", "http://localhost:3000"],
    credentials: true
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// Test routes
app.get("/test", (req, res) => res.json({ test: "success", success: true }));
app.get("/", (req, res) => res.status(200).json({ success: true, message: "Backend configured successfully" }));
app.get("/test2", (req, res) => res.status(200).json({ success: true, message: "Backend configured successfully" }));


app.post("/postLogin", (req, res) => {
    res.json({
        success: true,
        message: "post request successfull"
    })
})
// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is listening at port ${process.env.PORT}`);
});
