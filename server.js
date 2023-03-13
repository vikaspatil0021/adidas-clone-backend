import express from "express";
import mongoose from "mongoose"; 

import { UserInfo } from "./models/models.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());


import router from "./Routes/router.js";

await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })







app.use(router)
app.listen(process.env.PORT || 5000,(req,res)=>{

    console.log("Server has started on port 5000.");

})