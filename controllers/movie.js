import mongoose from "mongoose";
import Movie from "../models/movie.js";
import Manager from "../models/manager.js";
import badrequest from "../errors/badrequest.js";
import notfound from "../errors/notfound.js";
import { StatusCodes } from "http-status-codes";

export const createMovie=async(req,res)=>{
    const{title, posterUrl,releaseDate,genre}=req.body;
    req.body.Agent=Manager._id;
    // const user=await User.findById(req.user.id);
    if(!title||!posterUrl||!releaseDate||!genre){
        throw new badrequest("Please provode  all values");
    }
    const movie=await Movie.create(req.body);
    res.status(StatusCodes.CREATED).json({Movie: movie});
};
export const updatemovie=async(req,res)=>{
    // const property=await Property.findById(req.Property.id);
    const {id:movieId}=req.params;
    const movie=await Movie.findOne({_id:movieId});
    if(!movie){
        throw new notfound("No movie found");
    }
    const updatemovie=await Movie.findOneAndUpdate({_id:movieId},req.body,{
        new:true,
        runValidators:true,
    });
    res.status(StatusCodes.OK).json({updatemovie});
};
export const deletemovie=async(req,res)=>{
     const {id:MovieId}=req.params;
    const property=Movie.findById(MovieId);
    if(!property){
        throw new notfound("No movie is found");
    }
    const deleatemovie=await Movie.findByIdAndDelete(MovieId);
        req.status(StatusCodes.OK).json({ deleatemovie});
    
}
export const getallmovie=async(req,res,next)=>{
    try{
         const property=await Movie.find().populate("title genre director");
         return res.status(200).json(property);
    }catch(err){
        next(err);
    }
};
export const getmoviebyId=async(req,res,next)=>{
    try {
        const property=await Movie.findById(req.params.id).populate("title genre director");
        res.status(200).json(property);
    } catch (err) {
        next(err);
    }
}


