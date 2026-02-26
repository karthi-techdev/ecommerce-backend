import { Router } from "express";
import newsLetterController from "../controllers/newsLetterController";
const router = Router();

router.get("/", (req, res, next) =>
  newsLetterController.getAllNewsLetters(req, res, next),
);
router.post("/", (req, res, next) =>
  newsLetterController.createNewsLetter(req, res, next),
);
router.get("/getNewsLetterById/:id", (req, res, next) =>
  newsLetterController.getNewsLetterById(req, res, next),
);
router.put("/updateNewsLetter/:id", (req, res, next) =>
  newsLetterController.updateNewsLetter(req, res, next),
);
router.delete("/softDeleteNewsLetter/:id", (req, res, next) =>
  newsLetterController.softDeleteNewsLetter(req, res, next),
);

export default router;
