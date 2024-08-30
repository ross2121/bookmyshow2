import badrequest from "../errors/badrequest.js";
import Booking from "../models/booking.js";
import { StatusCodes } from "http-status-codes";
// import notfound from "../errors/notfound";
export const createbooking=async(req,res)=>{
   try {
    const{cinema,seat_id,user_id,movie_id}=req.body;
    if(!cinema||!seat_id||!user_id||!movie_id){
        throw new badrequest("Please provode  all values");
    }
    const booking=await Booking.create(req.body);
    // console.log("dasd");
    res.status(StatusCodes.CREATED).json({booking});
   } catch (error) {
    console.log(error);
   } 
};