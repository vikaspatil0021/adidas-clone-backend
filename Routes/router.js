import express from 'express';
import bcrypt from "bcrypt";
import Jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();

import { UserInfo,ProductInfo } from '../models/models.js';

const router = express.Router()


const ensureToken = (req,res,next) =>{
    const bHeader = req.headers["authorization"];
    if(typeof bHeader != 'undefined'){
        const bToken = (bHeader.split(' '))[1];
        req.token = bToken;

        next();
    }else{
        res.status(403).json({msg:"Invalid Token"});
    }
}

// verifying the token
const verifyToken = (token)=>{
    return Jwt.verify(token,process.env.TOKEN_SECRET_KEY,(err,data)=>{
        if(err){
            return {err:err.message};
        }else{
            return data;
        }
    })
}


router.post("/register", async(req, res) => {

    const { email, password} = req.body;

    try {
        const existingUser = await UserInfo.findOne({email:email});
        if(existingUser){
            return res.status(200).json({error:"Looks like you already have an account. Log in!"});
        }

        const hashPassword = await bcrypt.hash(password,10);

        const user = await UserInfo.create({
            email:email,
        password:hashPassword
        })
        const token = Jwt.sign({email:user.email,id:user._id},process.env.TOKEN_SECRET_KEY,{expiresIn:'1d'});
        res.status(200).json({token:token})
        
    } catch (error) {
        console.log(error.message);
        
    }
})

router.post("/login",async (req,res)=>{
    const {email , password} = req.body;

    const existingUser = await UserInfo.findOne({email:email});
        if(!existingUser){
            return res.status(200).json({message:"user doesnot exists "});
        }

    
    const matchPassword = await bcrypt.compare(password,existingUser.password);

    if(!matchPassword){
        return res.json({message:"Wrong password"});
    }
    const token = Jwt.sign({email:existingUser.email,id:existingUser._id},process.env.TOKEN_SECRET_KEY,{expiresIn:'1d'});
    res.status(200).json({token:token})



})
router.post('/checkUser',async(req,res)=>{
    const { email } = req.body;
    const existingUser = await UserInfo.findOne({email:email});
    if(existingUser){
        return res.status(200).json({user:"userExists"});
    }else{
        return res.status(200).json({error:"noUserExists"});

    }

})

router.post('/matchPassword', async(req,res)=>{
    const {email,password} = req.body;
    const existingUser = await UserInfo.findOne({email:email});
    const matchPassword = await bcrypt.compare(password,existingUser.password);
    if(!matchPassword){
        return res.status(200).json('bad')
    }

    return res.status(200).json("good")

})

router.post('/changePassword', async(req,res)=>{
    const {email,password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    const existingUser = await UserInfo.updateOne({email:email},{password:hashPassword});


    return res.status(200).json("good")

})


router.get('/products',async(req,res)=>{
    const data = await ProductInfo.find();
    res.status(200).json(data)
})





export default router;