import mongoose from "mongoose";
import Screen from "../models/screentime.js";
import Admin from "../models/admin.js";
import badrequest from "../errors/badrequest.js";
import cinema from "../models/cinema.js";
import notfound from "../errors/notfound.js";
import { StatusCodes } from "http-status-codes";
import  movie from  "../models/movie.js"
import router from "../routes/admin.js";

export const createscreen=async(req,res)=>{
    const{screenId,movieId}=req.body;
    // console.log("dsdsa");
    req.body.Agent=Admin._id;
    // const user=await User.findById(req.user.id);
    // if(!screenId||!movieId){
    //     throw new badrequest("Please provode  all values");
    // }
    const screen=await Screen.create(req.body);
    console.log("dasd");
    res.status(StatusCodes.CREATED).json({cinema: screen});
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
export const getallscren=async(req,res,next)=>{
    try{
         const screen=await screen.find().populate("screenId movieId");
         return res.status(200).json(screen);
    }catch(err){
        next(err);
    }
};
export const getscreencinemaid=async(req,res,next)=>{
    try {
     
      const cineamid=await movie.findById().populate("title");
      res.status(200).json(cineamid);
    } catch (error) {
        
    }
}
export const getScreensByCinemaId = async (req, res) => {
  try {
    const cinemaId = req.params.id;
    // const screens = await screen.find({ cinemaId }).populate("name image address");
    const screens = await Screen.find({ screenId:cinemaId });
    // Screen.findOne()
    console.log(screens);
    if (!screens || screens.length === 0) {
      return res.status(404).json({ message: 'No screens found for this cinema.' });
    }
    const screenData = screens.map(screen => ({
      movieId: screen.movieId,
      showtimes: screen.showtimes
    }));
    // Return the data
    res.status(200).json(screenData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching screens.' });
  }
};
export const getScreensByCinemaIdmovieid = async (req, res) => {
  try {
    const { cinemaId, movieId } = req.params; 
    // const screens = await screen.find({ cinemaId }).populate("name image address");
    const screens = await Screen.find({ screenId: cinemaId, movieId: movieId });
  
    // Screen.findOne()
    console.log(screens);
    if (!screens || screens.length === 0) {
      return res.status(404).json({ message: 'No screens found for this cinema.' });
    }
    const screenData = screens.map(screen => ({
      showtimes: screen.showtimes
      
    }));
  
    res.status(200).json(screenData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching screens.' });
  }
};

export const getcinemabyId=async(req,res,next)=>{
    try {
        const cinema=await screen.findById(req.params.id).populate("screenId");
        res.status(200).json(cinema);
    } catch (err) {
        next(err);
    }
}


