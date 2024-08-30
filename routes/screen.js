import express from "express";
import {auth,Adminauthorization} from "../middleware/auth.js";
import {createscreen,getallscren,getcinemabyId,getScreensByCinemaId,getScreensByCinemaIdmovieid,getseat} from "../controllers/screen.js";
import Stripe from "stripe";
import dotenv from "dotenv"
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
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    console.log("sad");
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
  
      // Handle the successful checkout session
      // Extract necessary data from session
      const { userId, cinemaName, movieName, seats } = session.metadata;
  
      // Save booking to the database
      await axios.post("http://localhost:5000/api/customer/booking", {
        user_id: userId,
        cinema: cinemaName,
        seat_id: seats, 
        movie_id: movieName,
        status: "confirmed",
      });
  
      res.status(200).json({ received: true });
    }
  });


export default router;
