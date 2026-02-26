import { Router } from "express";
import subCategoryController from "../controllers/subCategoryController";
import { upload } from "../utils/fileUpload" ;
import { setSubCategoryUpload } from "../middleware/setManagementName";
const router = Router();

router.post("/",setSubCategoryUpload,upload.single("image"), (req, res, next) =>subCategoryController.createSubCategory(req, res, next));
router.get("/",(req, res, next) =>subCategoryController.getAllSubCategories(req, res, next));
router.get("/activemain-categorylist",(req, res, next) =>subCategoryController.getAllActiveMainCategories(req, res, next));
router.get( "/getSubCategoryById/:id",(req, res, next) => subCategoryController.getSubCategoryById(req, res, next));
router.get('/activeSubCategory/:mainCategoryId',(req,res,next)=>subCategoryController.getSubCategoryByMainCategory(req,res,next));
router.put("/updateSubCategory/:id",upload.single("image"),(req, res, next) =>subCategoryController.updateSubCategory(req, res, next));
router.delete( "/softDeleteSubCategory/:id",(req, res, next) =>subCategoryController.softDeleteSubCategory(req, res, next));
router.patch("/togglestatus/:id",(req, res, next) =>subCategoryController.toggleSubCategoryStatus(req, res, next));
router.get("/trash",(req, res, next) =>subCategoryController.getAllTrashSubCategories(req, res, next));
router.patch("/restore/:id",(req, res, next) =>subCategoryController.restoreSubCategory(req, res, next));
router.delete( "/permanentDelete/:id",(req, res, next) =>subCategoryController.deleteSubCategoryPermanently(req, res, next));
router.post("/check-duplicate", upload.none(),(req, res, next) =>subCategoryController.checkDuplicate(req, res, next));

export default router;
