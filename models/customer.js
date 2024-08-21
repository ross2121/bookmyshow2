import mongoose from "mongoose";

const Customer=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    contactno:{                    
        type:Number,
        require:true
    },
    email:{
        type:String,
        required:[true,"Please provide emailid"],
        match:[  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique:true
    },
    password:{
        type:String,
        require:[true,"Please provide password"],
        // default:"",
    },
    googleSignIn:{
      type:String,
      default:false,
    },

    role: {
        type:String,
        default: "Customer",
        immutable: true, 
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
     bookedmovies:{
        type:String,
        
     },
     history:{
        type:String,

     }
        
    },
    {timestamps:true}
)
export default mongoose.model('Customer',Customer);
