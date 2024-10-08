import mongoose from "mongoose";
import Cinema from "../models/cinema.js";
import Admin from "../models/admin.js";
import badrequest from "../errors/badrequest.js";
import notfound from "../errors/notfound.js";
import { StatusCodes } from "http-status-codes";
// import badrequest from "../errors/badrequest.js";

export const createCinema=async(req,res)=>{
    const{name, Address}=req.body;
    // console.log("dsdsa");
    req.body.Agent=Admin._id;
    // const user=await User.findById(req.user.id);
    if(!name||!Address){
        throw new badrequest("Please provode  all values");
    }
    const cinema=await Cinema.create(req.body);
    console.log("dasd");
    res.status(StatusCodes.CREATED).json({cinema});
};
export const updateCinema = async (req, res) => {
    const { id: cinemaId } = req.params; // Ensure the route is correctly defined to accept an ID parameter
    const { name, Address } = req.body;

    if (!name || !Address) {
        throw new badrequest('Please provide all values');
    }

    const cinema = await Cinema.findOne({ _id: cinemaId });
    
    if (!cinema) {
        throw new NotFoundError(`No cinema with id: ${cinemaId}`);
    }
    const updatedCinema = await Cinema.findOneAndUpdate(
        { _id: cinemaId },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(StatusCodes.OK).json({ updatedCinema });
};

export const deletecinema=async(req,res)=>{
     const {id:cineamid}=req.params;
    const cinema=await Cinema.find({_id:cineamid});
    if(!cinema){
        throw new notfound("No Cinema is found");
    }
       const deletecinema=await Cinema.findByIdAndDelete(cineamid);
     res.status(StatusCodes.OK).json({deletecinema});
    
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
        const cinema=await Cinema.findById(req.params.id).populate("name Address");
        res.status(200).json(cinema);
    } catch (err) {
        next(err);
    }
}


