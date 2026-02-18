import { Router } from "express";
import PageController from "../controllers/pageController";

const pageRoutes = Router();

pageRoutes.post("/",(req, res, next) => PageController.createPage(req, res, next));
pageRoutes.get("/",(req, res, next) => PageController.getAllPages(req, res, next));
pageRoutes.put("/check-duplicate",(req, res, next) => PageController.checkDuplicate(req, res, next));
pageRoutes.get("/:id",(req, res, next) => PageController.getPagesById(req, res, next));
pageRoutes.put("/:id",(req, res, next) => PageController.updatePage(req, res, next));
pageRoutes.delete("/:id",(req, res, next) => PageController.softDeletePages(req, res, next));
pageRoutes.patch("/togglestatus/:id",(req, res, next) => PageController.togglePageStatus(req, res, next));
pageRoutes.delete("/permanent/:id",(req, res, next) => PageController.deletePagePermanently(req, res, next));
// pageRoutes.get("/trash",(req, res, next) =>PageController.getAllTrashPages(req, res, next));
// pageRoutes.patch("/restore/:id",(req, res, next) =>PageController.restorePages(req, res, next));
 
export default pageRoutes; 