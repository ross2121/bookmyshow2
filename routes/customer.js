import express from "express";
import { Register,Login,logout,generaotp,googleAuthSignIn,verifyotp,resetpassword,finduserbyemail,createResetSession} from "../controllers/auth.js";
import { auth} from "../middleware/auth.js";
import { updateProfile,deleteProfile } from "../controllers/customer.js";
import {createbooking} from "../controllers/payment.js"
// import { updateprofile } from "../controllers/admin.js";
import { bookingdetailtuser } from "../controllers/customer.js";



const router=express.Router();
router.post("/signup", Register, async (req, res, next) => {
    // After registering, move to OTP generation
    try {
        await generaotp(req, res);
        // await verifyotp(req,res);
    } catch (error) {
        next(error);
    }
});

router.post("/login",Login);
router.post("/logout",logout);
router.post("/google",googleAuthSignIn);
router.get("/findbyemail",finduserbyemail);
router.get("/generateotp",generaotp);
router.post("/verifyotp",verifyotp);
router.get("/createresetsession",createResetSession);
router.patch("/updateuser/:id",[auth],updateProfile);
router.delete("/deleteprofile/:id",[auth],deleteProfile);
router.post("/booking",createbooking);
router.get("/booking/:id",bookingdetailtuser);

// router.get("/updateprofile",auth,update);
router.put("/forgotpassword",resetpassword);
export default router;




