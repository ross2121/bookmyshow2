import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
    projectionType: {
        type: String,
        default: "INOX"
    },
    soundSystemType: {
        type: String,
        default: "INOX SOUND"
    },
    rows: {
        type: Number,
        required: true
    },
    columns: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        default: 0
    }
}, { _id: false });  

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    managerId: {
        type: Number,
        required: true
    },
    Address: {
        
            type: String,
            required: true
        
    },
    screens: [screenSchema] 
}, { timestamps: true });

export default mongoose.model("Cinema", cinemaSchema);
