// import Admin from "../models/agent.js";
// import badrequest from "../errors/badrequest.js";
// import Customer from "../models/customer.js";
// import notfound from "../errors/notfound.js";
// import { StatusCodes } from "http-status-codes";
// export const createprofile=async(req,res,next)=>{
//     const { contactno ,about,  License,  reviews}=req.body;
//     if(!contactno||!about||!License){
//            throw  new badrequest("Kindly fill all the details");
//     }
//     const profile=await Admin.create(req.body);
//     res.status(StatusCodes.CREATED.json({profile}));
// hi
// }

// export const updateprofile=async(req,res,next)=>{
//    if(req.params.id===req.user.id){
//     try {
//         const updateuser=await Admin.findByIdAndUpdate(req.body);
//         res.status(StatusCodes.OK.json({updateuser}));
//     } catch (error) {
        
//     }
//    }else{
//     throw new notfound("You can only update your profile");
//    }
// }

//  export const getRealtorProfile = async (req, res) => {
//         try {
//             const realtor = await Admin.findById(req.params.id).populate('listings reviews.customer', 'name');
//             if (!realtor) {
//                 return res.status(404).json({ error: 'Realtor not found' });
//             }
//             res.status(200).json(realtor);
//         } catch (error) {

//             res.status(500).json({ error: error.message });
//         }
    
//     };
//     export const getRealtorProfileforcustomer = async (req, res) => {
//         try {
//             try{const realtors = await Admin.find()
//                 .populate({ path: 'listings', select: 'property_name address' })
//                 .populate({ path: 'reviews.customer', select: 'name email' });
//             res.status(StatusCodes.OK).json(realtors);}
//             catch(error){
//                 console.log(error);
//             }
//         } catch (error) {
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//         }
    
//     }

