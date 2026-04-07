import { Router } from "express"
import cartController from '../controllers/cartController';
import { UserModel } from "../models/userModel";
const router=Router();
router.post('/addtocart',(req,res,next)=>cartController.addToCart(req,res,next));
router.get('/:id',(req,res,next)=>cartController.getAllCart(req,res,next));
router.delete('/:id',(req,res,next)=>cartController.deleteCart(req,res,next));
router.get('/getstats/:id',(req,res,next)=>cartController.getStats(req,res,next));
router.delete('/clearcart/:id',(req,res,next)=>cartController.clearCart(req,res,next));
export default router;