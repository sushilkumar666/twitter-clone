import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
 

dotenv.config({
    path:".env"
})
databaseConnection();
const app = express(); 

// middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());
 
   const corsOptions = {
    origin: ["https://twitter-clone-green-ten.vercel.app", "https://twitter-clone-frontend-iota.vercel.app"],
    credentials: true

}
app.use(cors(corsOptions));

// api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet", tweetRoute);
 
app.get("/test", (req,res)=> res.json({
    test:"success",
    success:true
}))

app.get("/", (req, res) => res.status(200).json({success: true, message :" backend  configured successfully hahahaha" }))
app.get("/test2", (req, res) => res.status(200).json({success: true, message :" backend  configured successfully hahahaha" }))


// app.get("/", (req, res) => {
//     app.use(express.static(path.resolve(__dirname, "frontend/twitterclone" , "build")));
//     res.sendFile(path.resolve(__dirname, "frontend/twitterclone", "build", "index.html"));
// })



app.listen(process.env.PORT,() => {
    console.log(`Server listen at port ${process.env.PORT}`);
})
