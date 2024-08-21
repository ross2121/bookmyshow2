import jwt from "jsonwebtoken";
import unaunthicated from "../errors/unauthinticated.js";
import Movie from "../models/movie.js";
export const auth=async(req,res,next)=>{
    console.log(  req.user);
   try {
    if(!req.headers.authorization) {
        throw new unaunthicated("Authantication error");
    }
    const token=req.headers.authorization.split(" ")[1];
    if(!token){
        throw new unaunthicated("Authoriazation error");
    }
    const decode= jwt.verify(token,process.env.JWT_TOKEN);
    req.user=decode;
    console.log(req.user);
    next();
   } catch (error) {
    console.log(error);
    res.status(402).json({error:error.message});
   }
}
export const authorizemanager = (req, res, next) => {
    const token=req.headers.authorization.split(" ")[1];
    const decode= jwt.verify(token,process.env.JWT_TOKEN);
    req.user=decode;
    // console.log("User from auth middleware:", req.user); // Log the user object
    if ( req.user && req.user.role=== "Customer") {
      console.log("Access denied. User role is not 'Customer'");
      throw new  unaunthicated("Access denied");
    }
    next();
  };
export const admin=async(req,res,next)=>{
   const movie=await Movie.findById(req.params.id);
    if(!movie){
      throw new unaunthicated("Movie not found");
    }
    Movie.findByIdAndUpdate(req.body);
    
    next();
}
export const Adminauthorization=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    const decode= jwt.verify(token,process.env.JWT_TOKEN);
    req.user=decode;
    
    if ( req.user && req.user.role=== "Customer"||req.user.role==="Manager") {
      console.log("Access denied. User role is not 'Customer'");
      throw new  unaunthicated("Access denied");
    }
    next();
}