import mongoose from "mongoose";
const Booking=new mongoose.Schema({
     user_id:{
        type:String,
        require:true,
        ref:"customer"
    },
    seat_id:{
       row:{
        type:Number,
        default:0
       },
       column:{
        type:Number,
        default:0
       }
    },
    movie_id:{
        type:String,
        require:true,
        ref:"movie" 
    },
    status:{
        type:String,
        // require:true,
        default:"pending",
    },
    cinema:{
        type:String,
        require:true,
    }
},
{timestamps:true})
export default mongoose.model("Booking",Booking);