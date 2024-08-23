import mongoose from "mongoose";
import screen from "../models/screentime.js";
import Admin from "../models/admin.js";
import badrequest from "../errors/badrequest.js";
import notfound from "../errors/notfound.js";
import { StatusCodes } from "http-status-codes";

export const createscreen=async(req,res)=>{
    const{screenId,movieId}=req.body;
    // console.log("dsdsa");
    req.body.Agent=Admin._id;
    // const user=await User.findById(req.user.id);
    if(!screenId||!movieId){
        throw new badrequest("Please provode  all values");
    }
    const cinema=await screen.create(req.body);
    console.log("dasd");
    res.status(StatusCodes.CREATED).json({cinema});
};
export const updatecinema=async(req,res)=>{
    // const property=await Property.findById(req.Property.id);
    const {id:CinemaId}=req.params;
    const cinema=await screen.findOne({_id:CinemaId});
    if(!cinema){
        throw new notfound("No cinema found");
    }
    const updatecinema=await screen.findOneAndUpdate({_id:CinemaId},req.body,{
        new:true,
        runValidators:true,
    });
    res.status(StatusCodes.OK).json({updateproperty: updatecinema});
};
export const deletecinema=async(req,res)=>{
     const {id:cineamid}=req.params;
    const cinema=screen.findById(cineamid);
    if(!cinema){
        throw new notfound("No Cinema is found");
    }
    const deleteproperty=await screen.findByIdAndDelete(cineamid);
        req.status(StatusCodes.OK).json({deleteproperty});
    
}
export const random=async(req,res)=>{

        const property=await screen.aggregate([{$sample:{size:40}}]).populate("Agent","name image").populate("property");
        res.status(200).json({property});
    
}
export const filterpricrange=async(req,res)=>{
    
}

export const getallcinema=async(req,res,next)=>{
    try{
         const property=await screen.find().populate("Admin","name img address");
         return res.status(200).json(property);
    }catch(err){
        next(err);
    }
};
export const getcinemabyId=async(req,res,next)=>{
    try {
        const cinema=await screen.findById(req.params.id).populate("Agent","name image address");
        res.status(200).json(cinema);
    } catch (err) {
        next(err);
    }
}


