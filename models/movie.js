import mongoose from "mongoose";

const movie=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    timing:{                    
        type:Number,
        require:true
    },
    duration:{
        type:Number,
        require:true
    },
    about:{
        type:String,
        require:true,
    },
    License:{
        type:String,
        require:true
    },
    seats:{
        type:Number,
        require:true
    },
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
