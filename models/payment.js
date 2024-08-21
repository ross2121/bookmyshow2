import mongoose from "mongoose";
const Payment=new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
},
{timestamps:true}
)
export default mongoose.model("Payment",Payment)