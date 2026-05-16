import express from "express";
import {
  addSearchController,
  getSearchHistoryController,
  clearHistoryController,
  removeSearchItemController
} from "../controllers/SearchHistoryControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const SearchHistoryRoute = express.Router();

SearchHistoryRoute.post("/add", authMiddleware, addSearchController);
SearchHistoryRoute.get("/", authMiddleware, getSearchHistoryController);
SearchHistoryRoute.delete("/clear", authMiddleware, clearHistoryController);
SearchHistoryRoute.delete("/remove/:id", authMiddleware, removeSearchItemController);

export default SearchHistoryRoute;