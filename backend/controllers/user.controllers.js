import userModel from "../modles/user.model.js";
import * as userService from '../services/user.service.js';
import {validationResult} from 'express-validator'
import redisClient from "../services/redis.service.js";

export const createUserController=async(req,res)=>
{
    const errors=validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});

    try{
        const user=await userService.createUser(req.body);
        const token = user.generateJWT();
        delete user._doc.password;
        return res.status(201).json({user, token});
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}
export const loginUserController=async(req,res)=>
{
    const errors=validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});

    try{
        const {email,password}=req.body;
        const user =await userModel.findOne({email}).select('+password');
        if(!user) return res.status(400).json({error:"Invalid email or password"});
        const isMatch=await user.isValidPassword(password);
        if(!isMatch) return res.status(400).json({error:"Invalid email or password"});
        const token = user.generateJWT();
        delete user._doc.password;
        return res.status(200).json({user, token});
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}
export const profileController=async(req,res)=>
{
    console.log(req.user);
    res.status(200).json({user:req.user});
}
export const logoutController=async(req,res)=>
{
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token) return res.status(401).json({error:"Unauthorized"});

        // Invalidate the token in Redis
         redisClient.set(token, 'invalid', {EX: 3600*24}); // Set expiration as needed

        // res.clearCookie('token');
        return res.status(200).json({message:"Logged out successfully"});
    }catch(err){
        return res.status(500).json({error:err.message});
    }
}   
export const getAllUsers=async(req,res)=>{
    try{
        const loggedInUser=await userModel.findOne({email:req.user.email})
        const allUsers=await userService.getAllUsers({userId:loggedInUser._id});
        return res.status(200).json({users:allUsers});
    }
    catch(error)
    {
        return res.status(500).json({error:error.message});
    }
}