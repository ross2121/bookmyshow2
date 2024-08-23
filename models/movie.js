import mongoose from "mongoose";

const movie=new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    genre:{                    
        type:String,
        require:true
    },
    director:{
        type:String,
        require:true
    },
    duration:{
        type:String,
        require:true,
    },
    releaseDate:{
        type:String,
        require:true
    },
    posterUrl:{
        type:String,
        require:true
    }
       
    ,
    reviews:
        [{
            customer:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"customer"
            },
            rating:{
                type:Number,
                min:1,
                max:5,
            },
            comments:{
                type:String,
            },
        }],
    
        
    },
    {timestamps:true}
)
export default mongoose.model('movie',movie);
