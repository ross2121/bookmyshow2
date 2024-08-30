
import Manager from "../models/manager.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import otp from "otp-generator"
import nodemailer from "nodemailer"
import badrequest from "../errors/badrequest.js"
import dotenv from "dotenv";
// import { retry } from "@reduxjs/toolkit/query";
// import { use } from "moongose/routes";
dotenv.config();
const OTp="";
export const tranporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
    },
    port:465,
    secure:false,
    host:'smtp.gmail.com'
})

export const Register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            throw new badrequest("Please provide name, email, and password");
        }

        const existingUser = await Manager.findOne({ email });
        if (existingUser) {
            return res.status(409).send({
                message: "Email is already in use"
            });
        }
        req.session.tempUser = { name, email, password };
        req.app.locals.OTP = otp.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
            digits: true
        });

        await generaotp(req, res);

        // Send a response indicating that OTP was sent
        res.status(200).send({ message: "OTP sent. Please verify to complete registration." });
    } catch (error) {
        next(error);
    }
};

export const Login=async(req,res,next)=>{
    const { password, email } = req.body;
if (!password || !email) {
    throw new badrequest("Please provide name, email, and password");
}

try {
    const user = await Manager.findOne({ email });
    if (!user) {
        throw new badrequest("User not found");
    }

    // if (user.googleSignIn) {
    //     throw new badrequest("Entered email is signed up with Google. Kindly sign in with Google.");
    // }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        throw new badrequest("Wrong password", 401);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_TOKEN, { expiresIn: "365d" });
    res.status(200).json({ token, user });
} catch (err) {
    next(err); // This will trigger your global error handler
}

}
export const googleAuthSignIn=async(req,res,next)=>{
    const {email,password,name}=req.body
    try {
        const user=await Manager.findOne({email})
        if(!user){
            try {
                const user=new Manager({...req.body,googleSignIn:true});
                await user.save();
                const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_TOKEN,{expiresIn:"1 years"})
                res.status(200).json({token,user:user});
            } catch (error) {
                next(error)
            }}
            else if(user.googleSignIn){
                const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_TOKEN,{expiresIn:"1 year"})
                res.status(200).json({token,user})
            }else if(!user.googleSignIn){
                throw new badrequest("User alredy register with this email cant do google auth")
            }
                     
    } catch (error) {
        next(error)
    }
}
export const logout=(req,res,next)=>{
    res.clearCookie("acess_token").json({message:"Logged out"})
}
export const  generaotp=async(req,res)=>{
    req.app.locals.OTP= otp.generate(6,{upperCaseAlphabets:false,specialChars:false,lowerCaseAlphabets:false,digits:true});
   console.log(req.app.locals.OTP)
const {name,email,reason}=req.body
console.log(email);

const verifyotp={
    from:process.env.EMAIL_USERNAME,
    to:email,
    subject:'Account verification OTP',
    html:` <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your BookSHow Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a Bookmyshow  account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the Realtor app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a bookshow account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The Realtor Team</p>
</div>`
};
const resetpasswordotp={
    from:process.env.EMAIL_USERNAME,
    to:email,
    subject:"Realtor Reset password verification",
    html:`<div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Reset Your Realtor Account Password</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your Realtor account password, please enter the following verification code:</p>
                        <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the Realtor app to reset your password.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The PODSTREAM Team</p>
            </div>`
};
// console.log(reason);
if(reason=="FORGOTPASSWORD"){
    tranporter.sendMail(resetpasswordotp,(err)=>{
        if(err){
            next(err)
        }else{
            return res.status(200).send({message:"OTP sent"});

        }
    })
}else{
    try{tranporter.sendMail(verifyotp,(err)=>{
        if(err){
            res.send(err);
        }
        else{
            return res.status(200).send({message:"OTP Sent"});
        }
    })
}catch(error){
    console.log(error);
    }
}
}
export const verifyotp = async (req, res, next) => {
    const { code } = req.body;
    console.log(code);
    if (parseInt(code) === parseInt(req.app.locals.OTP)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        
        // Retrieve the temporarily stored user data
        const { name, email, password } = req.session.tempUser;
        
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        // Create new user and save to the database
        const newUser = new Manager({ name, email, password: hashedPassword });
        await newUser.save();
        
        // Generate token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_TOKEN, { expiresIn: "365d" });
        
        res.status(200).json({ token, user: newUser });
    } else {
        throw new badrequest(201, "Wrong OTP");
    }
};
export const createResetSession=async(req,res,next)=>{
    if(req.app.locals.resetSession){
        req.app.locals.resetSession=false
        return res.status(200).send({message:"Access granted"})
    }
    return res.status(400).send({message:"Session expired"})
}
export const finduserbyemail=async(req,res,next)=>{
    const {email}=req.query;
    try {
        const user=await Manager.findOne({email:email});
        if(user){
            return res.status(200).send({
                message:"User found"
            })
        }
        else{
            return res.status(202).send({
                message:"User not found"
            })
        }
    } catch (error) {
        next(error);
    }
}
export const resetpassword=async(req,res,next)=>{
    if(!req.app.locals.resetSession){
        return res.status(440).send({message:"Session end"});
    
    }
    const {email}=req.body;
    try {
        await Manager.findOne({email}).then(user=>{
            if(user){
                const salt=bcrypt.genSaltSync(10);
                const hashedpassword=bcrypt.hashSync(password,salt);
                Manager.updateOne({email:email},{$set:{password:hashedpassword}})
                req.app.locals.resetSession=false;
                return res.status(200).send({
                    message:"Password reset sucessfull"
                }).catch(err=>{
                    next(err);
                })
            }
            else{
                return res.status(202).send({
                    message:"User not found"
                })
            }
        })
    } catch (error) {
        next(error)
    }
}
