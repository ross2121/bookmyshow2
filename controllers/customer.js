import { StatusCodes } from 'http-status-codes';
import Customer from '../models/customer.js'; 
import badrequest from '../errors/badrequest.js'; 
import unauthonticated from '../errors/unauthinticated.js';
import notfound from '../errors/notfound.js';
import Booking from '../models/booking.js';
import { jwtDecode } from "jwt-decode";
export const updateProfile = async (req, res) => {
    const { id: userId } = req.params; // ID of the profile to update
    const { name, email, password } = req.body; // Fields to update

    // Ensure the user is authenticated

    const authenticatedUserId = req.user.id;

    // Check if the user is trying to update their own profile
    if (userId !== authenticatedUserId) {
        throw new unauthonticated('You can only update your own profile');
    }

    // Validate input (this can be more comprehensive)
    if (!name || !email) {
        throw new badrequest('Please provide all required values');
    }

    const user = await Customer.findOne({ _id: userId });

    if (!user) {
        throw new notfound(`No user found with id: ${userId}`);
    }

    // Update the user profile
    const updatedUser = await Customer.findOneAndUpdate(
        { _id: userId },
        req.body,
        {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators on update
        }
    );

    res.status(StatusCodes.OK).json({ updatedUser });
};
export const deleteProfile = async (req, res) => {
    const { id: userId } = req.params; 
    const authenticatedUserId = req.user.id; 
    if (userId !== authenticatedUserId) {
        throw new UnauthorizedError('You can only delete your own profile');
    }

    const user = await Customer.findOneAndDelete({ _id: userId });

    if (!user) {
        throw new NotFoundError(`No user found with id: ${userId}`);
    }

    res.status(StatusCodes.NO_CONTENT).send(); // Send no content status code
};
export const bookingdetailtuser=async(req,res,next)=>{
    const id=req.params.id;
    const booking=await Booking.find({user_id:id}).populate("user_id cinema ");
if(!booking){
    throw new NotFoundError("No booking find");
}
res.status(200).json({booking});
}
