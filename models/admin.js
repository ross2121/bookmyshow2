import mongoose from "mongoose";

const Admin=new mongoose.Schema({
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
        default: "Admin",
        immutable: true, 
    },
   
     Movie:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"movie"
        }
        
    },
    {timestamps:true}
)
export default mongoose.model('Admin',Admin);
