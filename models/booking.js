import mongoose from "mongoose";
const Booking=new mongoose.Schema({
     user_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"customer"
    },
    seat_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"seat"
    },
     movie_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"movie" 
    },
    status:{
        type:String,
        require:true,
        default:"pending",
    }
   

},
{timestamps:true})
export default mongoose.model("Booking",Booking);