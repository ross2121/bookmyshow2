import express from "express";
import { Register,Login,logout,generaotp,googleAuthSignIn,verifyotp,resetpassword,finduserbyemail,createResetSession} from "../controllers/managerauth.js";
import { auth} from "../middleware/auth.js";


const router=express.Router();
router.post("/signin",Register);
router.post("/login",Login);
router.post("/logout",logout);
router.post("/google",googleAuthSignIn);
router.get("/findbyemail",finduserbyemail);
router.get("/generateotp",generaotp);
router.get("/verifyotp",verifyotp);
router.get("/createresetsession",createResetSession);
// router.get("/updateprofile",auth,update);
router.put("/forgotpassword",resetpassword);
export default router;




