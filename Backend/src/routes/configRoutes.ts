import Router from 'express';
import configController from '../controllers/configController';
const router=Router();
router.post('/',configController.createConfig);
router.get('/',configController.getAllConfig);
router.get('/getConfigById/:id',configController.getConfigById);
router.get('/configStats',(req,res,next)=>{configController.getConfigStats(req,res,next)});
router.put('/editConfig/:id',configController.updateConfig);
router.delete('/deleteConfig/:id',configController.deleteConfig);
router.patch('/togglestatus/:id',(req,res,next)=>{configController.toggleStatus(req,res,next)})
export default router;