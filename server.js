import express from "express";
import mongoose from "mongoose"; 
import bodyParser from "body-parser";
import { UserInfo } from "./models/models.js";
import router from "./Routes/router.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();

import cors from "cors";
const corsOptions = {
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    origin: ["http://abc1.localhost:8000","https://adidas-clone-0021.vercel.app","https://d9xdcjqkjzcuq.cloudfront.net","https://du28bxupm4y6.cloudfront.net"]


}


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors(corsOptions));









app.use(router)
app.listen(process.env.PORT || 5000,(req,res)=>{

    console.log("Server has started on port 5000.");

})
