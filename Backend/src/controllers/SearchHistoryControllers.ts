import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  addSearch,
  getSearchHistory,
  clearHistory,
  removeSearchItem
} from "../services/SearchHistoryService";

// Add search
// export const addSearchController = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { query } = req.body;
//     const userId = req.user.id;

//     const search = await addSearch(userId, query);

//     res.status(201).json({
//       message: "Search saved",
//       search,
//     });
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// };

export const addSearchController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { query } = req.body;
    
    // Check both 'id' and '_id' because JWT structures vary
    const userId = req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in token" });
    }

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const search = await addSearch(userId, query);

    res.status(201).json({
      message: "Search saved",
      search,
    });
  } catch (error: any) {
    console.error("Controller Error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get search history
export const getSearchHistoryController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    const history = await getSearchHistory(userId);

    res.status(200).json({
      history,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Clear all history
export const clearHistoryController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id || req.user._id;
    await clearHistory(userId);
    res.status(200).json({ message: "History cleared" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Remove single item
export const removeSearchItemController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    await removeSearchItem(userId, id);
    res.status(200).json({ message: "Item removed" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};