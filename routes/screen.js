import express from "express";
import {auth,Adminauthorization} from "../middleware/auth.js";
import {createscreen,getallscren,getcinemabyId,getScreensByCinemaId,getScreensByCinemaIdmovieid,getseat} from "../controllers/screen.js";
import { createpayment } from "../controllers/seat.js";
const router=express.Router();
router.post('/screen',[auth,Adminauthorization],createscreen);
// router.patch('/cinema/:id',[Adminauthorization],updatecinema);
// router.delete('/cinema/:id',[Adminauthorization],deletecinema);
router.get('/screen',getallscren);
router.get('/screen/:id',getcinemabyId);

router.get('/screen/cinema/:id',getScreensByCinemaId);
router.get('/screen/:cinemaId/:movieId', getScreensByCinemaIdmovieid);
router.get('/screen/cinema/:id/seat',getseat);
router.post('/payment',createpayment);

export default router;
