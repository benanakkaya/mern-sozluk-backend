import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./routes/UserRoute.js"
import topicRouter from "./routes/TopicRoute.js"
import entryRouter from "./routes/EntryRoute.js"
import channelRouter from "./routes/ChannelRoute.js"
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

export const transporter = nodemailer.createTransport({
    service:"yandex",
    host:"smtp.yandex.com.tr",
    port:"465",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
    }
});

app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))


app.get("/", (req,res) => {
    res.send("Sözlük Projesi Backend")
})

app.use("/user", userRouter);
app.use("/topic", topicRouter);
app.use("/entry", entryRouter);
app.use("/channel", channelRouter);



const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

app.listen(PORT,() => {
    try {
        console.log("Server is up this port:",PORT);
        mongoose.connect(DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology: true}).then(() => {
                console.log("Connected to database")
            }).catch((err) => {
                console.log(err.message)
            })
    } catch (error) {
        console.log(error.message)
    }
    
})