import mongoose from "mongoose";
const screentime = new mongoose.Schema({
    screenId: {
      type: String,
    //   ref: 'screen',
      required: true
    },
    movieId: {
      type:String,
      ref: 'movie',
      required: true
    },
    showtimes: [
      {
        time: {
          type: Date,
          required: true
        }
      }
    ]
  });
  
  export default mongoose.model('screen',screentime);