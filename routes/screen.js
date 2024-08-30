import express from "express";
import {auth,Adminauthorization} from "../middleware/auth.js";
import {createscreen,getallscren,getcinemabyId,getScreensByCinemaId,getScreensByCinemaIdmovieid,getseat} from "../controllers/screen.js";
import Stripe from "stripe";
import dotenv from "dotenv"
import Booking from "../models/booking.js";
import {screeafterbooked} from "../controllers/seat.js"
dotenv.config();
import { createpayment } from "../controllers/seat.js";
const router=express.Router();
const stripe=Stripe(process.env.STRIPE_SECRET_KEY)
router.post('/screen',[auth,Adminauthorization],createscreen);
// router.patch('/cinema/:id',[Adminauthorization],updatecinema);
// router.delete('/cinema/:id',[Adminauthorization],deletecinema);
router.get('/screen',getallscren);
router.get('/screen/:id',getcinemabyId);

router.get('/screen/cinema/:id',getScreensByCinemaId);
router.get('/screen/:cinemaId/:movieId', getScreensByCinemaIdmovieid);
router.get('/screen/cinema/:id/seat',getseat);
router.post('/payment',createpayment)
// router.get('/getb/:id',screeafterbooked);
router.post("/webhooks", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature']; 
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
  
      // Create a booking in your database
      const booking = new Booking({
        user_id: session.metadata.userId,
        status: "confirmed",
        cinema: session.metadata.cinemaName,
        movie_id: session.metadata.movieName,
        screen_id: session.metadata.screen_id,
        // seat_id: JSON.parse(session.metadata.seats)
      });
  
      try {
        await booking.save();
        console.log("Booking successfully saved!");
      } catch (error) {
        console.error("Error saving booking:", error);
      }
    }
  
    res.json({ received: true });
  });
  


export default router;
