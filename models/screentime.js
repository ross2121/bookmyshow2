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
    bookedticket:[
      {
        row:{
          type:String,
          required:true,
          default:"0"
        },
        column:{
          type:String,
          required:true,
          default:"0"
        }

      },

    ],
    showtimes: [
      {
        time: {
          type: Date,
          _id: mongoose.Schema.Types.ObjectId,
          required: true
        }
      }
    ]
  });
  
  export default mongoose.model('screen',screentime);