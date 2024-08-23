import mongoose from "mongoose";
  const screentime=new mongoose.Schema({

    showtimes: [{
        time:String
    }],
    screenId:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"cinema"
        },
    movieId: {
type:mongoose.Schema.Types.ObjectId,
ref:'movie'
    }
  })
  export default mongoose.model('screen',screentime);