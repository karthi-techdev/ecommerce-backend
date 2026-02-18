import { Router } from "express";
import productController from "../controllers/productController";
import { upload } from "../utils/fileUpload";
import { setProductUpload } from "../middleware/setManagementName";

const router = Router();

router.post('/',setProductUpload,upload.array('images', 5),(req, res, next) => productController.createProduct(req, res, next));
router.get('/',(req, res, next) => productController.getProducts(req, res, next));
router.get('/getProductById/:id',(req, res, next) => productController.getProductById(req, res, next));
router.put('/updateProduct/:id',setProductUpload,upload.array('images', 5),(req, res, next) => productController.updateProduct(req, res, next));
router.patch('/softDelete/:id',(req, res, next) => productController.softDeleteProduct(req, res, next));
router.delete('/permanentDelete/:id',(req, res, next) => productController.deleteProductPermanently(req, res, next));
router.patch('/restore/:id',(req, res, next) => productController.restoreProduct(req, res, next));
router.patch('/toggleStatus/:id',(req, res, next) => productController.toggleStatus(req, res, next));
router.get('/trash',(req, res, next) => productController.getAllTrash(req, res, next));

export default router;
