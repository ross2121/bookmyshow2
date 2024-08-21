import  notfound from "../errors/notfound.js";
import Customer from "../models/customer.js";
export const update=async(req,res)=>{
    if(req.param.id===req.user.id){
        try {
            const updateuser=await Customer.findByIdAndUpdate(
                req.params.id,
                {
                    $set:req.body,
                },{
                    new:true
                }
            );
            res.status(200).json(updateuser);
        } catch (error) {
            throw new notfound("User not found");
        }
    }
    else{
       throw new notfound("You can only update your profile");
    }

}
