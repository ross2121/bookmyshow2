import express from "express";
import { Register,Login,logout,generaotp,googleAuthSignIn,verifyotp,resetpassword,finduserbyemail,createResetSession,getuser,updateuser,deleateuser,getuserbyid} from "../controllers/adminauth.js";
import { auth,authorizemanager} from "../middleware/auth.js";

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
router.patch("/user/:id",[authorizemanager],updateuser);
router.delete("/user/:id",[authorizemanager],deleateuser);
router.get("/user",getuser);
router.get("/user/:id",[authorizemanager],getuserbyid);

// router.get("/updateprofile",auth,update);
router.put("/forgotpassword",resetpassword);
export default router;




