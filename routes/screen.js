import express from "express";
import { auth, Adminauthorization } from "../middleware/auth.js";
import { Router } from "express";
import {
  createscreen,
  getallscren,
  getcinemabyId,
  getScreensByCinemaId,
  getScreensByCinemaIdmovieid,
  getseat
} from "../controllers/screen.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/booking.js";
import nodemailer from "nodemailer";
import { screeafterbooked, createpayment,afterconfirmation,deleteshowtime } from "../controllers/seat.js";

dotenv.config();
const router=Router();

router.post('/screen', [auth, Adminauthorization], createscreen);
router.get('/screen', getallscren);
router.get('/screen/:id', getcinemabyId);
router.get('/screen/cinema/:id', getScreensByCinemaId);
router.get('/screen/:cinemaId/:movieId', getScreensByCinemaIdmovieid);
router.get('/screen/cinema/:id/seat', getseat);
router.post('/payment', createpayment);
router.delete('/screen/:id',deleteshowtime);
router.get('/booking/sucess/:id',afterconfirmation);


export default router;
