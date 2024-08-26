import mongoose from "mongoose";
import Cinema from "../models/cinema.js";
import Admin from "../models/admin.js";
import badrequest from "../errors/badrequest.js";
import notfound from "../errors/notfound.js";
import { StatusCodes } from "http-status-codes";

export const createCinema=async(req,res)=>{
    const{name, Address}=req.body;
    console.log("dsdsa");
    req.body.Agent=Admin._id;
    // const user=await User.findById(req.user.id);
    if(!name||!Address){
        throw new badrequest("Please provode  all values");
    }
    const cinema=await Cinema.create(req.body);
    console.log("dasd");
    res.status(StatusCodes.CREATED).json({cinema});
};
export const updatecinema=async(req,res)=>{
    // const property=await Property.findById(req.Property.id);
    const {id:CinemaId}=req.params;
    const cinema=await Cinema.findOne({_id:CinemaId});
    if(!cinema){
        throw new notfound("No cinema found");
    }
    const updatecinema=await Cinema.findOneAndUpdate({_id:CinemaId},req.body,{
        new:true,
        runValidators:true,
    });
    res.status(StatusCodes.OK).json({updateproperty: updatecinema});
};
export const deletecinema=async(req,res)=>{
     const {id:cineamid}=req.params;
    const cinema=Cinema.findById(cineamid);
    if(!cinema){
        throw new notfound("No Cinema is found");
    }
    const deleteproperty=await Cinema.findByIdAndDelete(cineamid);
        req.status(StatusCodes.OK).json({deleteproperty});
    
}
export const random=async(req,res)=>{

        const property=await Cinema.aggregate([{$sample:{size:40}}]).populate("Agent","name image").populate("property");
        res.status(200).json({property});
    
}
export const filterpricrange=async(req,res)=>{
    
}
export const rowbyseatid=async(req,res)=>{
    try {
     const seatid=req.params.id;
        const seat=await Cinema.find(seatid);
        return res.status(seat);
    } catch (error) {
        console.log(error);
    }
}

export const getallcinema=async(req,res,next)=>{
    try{
         const property=await Cinema.find().populate("name Address");
         return res.status(200).json(property);
    }catch(err){
        next(err);
    }
};
export const getcinemabyId=async(req,res,next)=>{
    try {
        const cinema=await Cinema.findById(req.params.id).populate("name image address");
        res.status(200).json(cinema);
    } catch (err) {
        next(err);
    }
}


