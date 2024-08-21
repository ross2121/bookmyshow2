import mongoose from "mongoose";
const Seats=new mongoose.Schema({
    seatNumber: { type: String, required: true },
    status: { type: String, enum: ['available', 'pending', 'booked'], default: 'available' },
    cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true }
},{
    timestamps:true
})
export default mongoose.model("Seats",Seats);