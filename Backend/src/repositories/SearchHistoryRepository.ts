import searchHistoryModel, {
  ISearchHistory,
} from "../models/SearchHistoryModel";

// Create new search
export const createSearch = async (
  data: Partial<ISearchHistory>
): Promise<ISearchHistory> => {
  return await searchHistoryModel.create(data);
};

// Get last 5 searches for a user
export const getUserSearches = async (
  userId: string
): Promise<ISearchHistory[]> => {
  return await searchHistoryModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);
};

// Delete oldest search (to maintain only 5)
export const deleteOldestSearch = async (userId: string) => {
  const oldest = await searchHistoryModel
    .find({ userId })
    .sort({ createdAt: 1 })
    .limit(1);

  if (oldest.length > 0) {
    await searchHistoryModel.findByIdAndDelete(oldest[0]._id);
  }
};

// Count user searches
export const countUserSearches = async (
  userId: string
): Promise<number> => {
  return await searchHistoryModel.countDocuments({ userId });
};

// Delete all searches for a user
export const clearAllSearches = async (userId: string) => {
  return await searchHistoryModel.deleteMany({ userId });
};

// Delete a specific search by ID (and userId for security)
export const deleteSearchById = async (userId: string, searchId: string) => {
  return await searchHistoryModel.deleteOne({ _id: searchId, userId });
};