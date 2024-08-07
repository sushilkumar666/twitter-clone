import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path: "../config/.env"
})
const databaseConnection = async () => {
    // mongoose.connect(process.env.MONGO_URI).then(()=>{
    //     console.log("Connected to mongoDB");
    // }).catch((error)=>{
    //     console.log(error);
    // })

    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://sushilssharma064:sushilssharma064@cluster0.y3mxeba.mongodb.net/twitterClone`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}
export default databaseConnection;