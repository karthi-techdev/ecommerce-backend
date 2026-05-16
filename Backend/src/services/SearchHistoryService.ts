// import mongoose from "mongoose";
// import {
//   createSearch,
//   getUserSearches,
//   deleteOldestSearch,
//   countUserSearches,
// } from "../repositories/SearchHistoryRepository";

// // Add search
// export const addSearch = async (
//   userId: string,
//   query: string
// ) => {
//   const objectUserId = new mongoose.Types.ObjectId(userId); 

//   const count = await countUserSearches(objectUserId.toString());

//   if (count >= 5) {
//     await deleteOldestSearch(objectUserId.toString());
//   }

//   return await createSearch({
//     userId: objectUserId, 
//     query,
//   });
// };

// // Get history
// export const getSearchHistory = async (userId: string) => {
//   return await getUserSearches(userId);
// };


// Add search
import mongoose from "mongoose";
import searchHistoryModel from "../models/SearchHistoryModel";
import {
  createSearch,
  getUserSearches,
  deleteOldestSearch,
  countUserSearches,
  clearAllSearches,
  deleteSearchById
} from "../repositories/SearchHistoryRepository";

export const addSearch = async (userId: string, query: string) => {
  // Be specific with errors
  if (!userId) throw new Error("User ID is missing in Service");
  if (!query) throw new Error("Query is missing in Service");

  const objectUserId = new mongoose.Types.ObjectId(userId);
  const trimmedQuery = query.trim();

  // 1. Remove existing entry to avoid duplicates and move to top
  await searchHistoryModel.deleteOne({ userId: objectUserId, query: trimmedQuery });

  // 2. Check current count
  const count = await countUserSearches(objectUserId.toString());

  // 3. If at 5, delete oldest
  if (count >= 5) {
    await deleteOldestSearch(objectUserId.toString());
  }

  // 4. Create new
  return await createSearch({
    userId: objectUserId,
    query: trimmedQuery,
  });
};

export const getSearchHistory = async (userId: string) => {
  return await getUserSearches(userId);
};

export const clearHistory = async (userId: string) => {
  return await clearAllSearches(userId);
};

export const removeSearchItem = async (userId: string, searchId: string) => {
  return await deleteSearchById(userId, searchId);
};