import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
  user_id: {
    type: String,
    // ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  cinema: {
    type: String,
    required: true,
  },
  movie_id: {
    type: String,
    required: true,
  },
  screen_id:{
    type:String,
    require:true
  },
  seat_id: 
     [{
      row: {
        type: Number,
        default: 0,
        required: true,
      },
      column: {
        type: Number,
        default: 0,
        required: true,
      },
    }], 
});

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
