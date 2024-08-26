import express from "express";
import {auth,Adminauthorization} from "../middleware/auth.js";
import {createCinema,deletecinema,updatecinema,getallcinema,getcinemabyId,rowbyseatid} from "../controllers/cinema.js";
const router=express.Router();
router.post('/cinema',[auth,Adminauthorization],createCinema);
router.patch('/cinema/:id',[Adminauthorization],updatecinema);
router.delete('/cinema/:id',[Adminauthorization],deletecinema);
router.get('/cinema',getallcinema);
router.get('/cinema/:id',getcinemabyId);

export default router;
