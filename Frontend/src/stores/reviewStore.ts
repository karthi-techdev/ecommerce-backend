import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import ImportedURL from "../common/urls";
import type { Review } from "../types/common";

const { API } = ImportedURL;

interface ReviewState {
  reviews: Review[];
  stats: { total: number; uniqueUsers: number };
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchReviews: (
    page?: number,
    limit?: number,
    productId?: string,
  ) => Promise<void>;
  fetchReviewById: (id: string) => Promise<any>;
  updateReview: (id: string, reviewData: any) => Promise<void>;
  updateReviewStatus: (id: string, status: string) => Promise<void>;
  toggleReviewStatus: (id: string) => Promise<void>;
  deleteReview: (id: string, userId: string) => Promise<void>;
  addReview: (reviewData: any) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [] as Review[],
  stats: { total: 0, uniqueUsers: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchReviews: async (page = 1, limit = 10, productId?: string) => {
    try {
      set({ loading: true, error: null });

      const url = productId
        ? `${API.listReviews}?page=${page}&limit=${limit}&productId=${productId}`
        : `${API.listReviews}?page=${page}&limit=${limit}`;

      const res = await axiosInstance.get(url);

      const reviewsData = res?.data?.data?.data || [];
      const meta = res?.data?.data?.meta || {};

      set({
        reviews: reviewsData,
        page,
        totalPages: meta?.totalPages || 1,
        stats: {
          total: meta?.totalItems || reviewsData.length || 0,
          uniqueUsers: meta?.totalUsers || 0,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch reviews",
        loading: false,
      });
    }
  },

  fetchReviewById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.listReviews}/${id}`);
      set({ loading: false });
      return res.data.data;
    } catch (error: any) {
      set({ loading: false, error: "Failed to fetch review details" });
      return null;
    }
  },

  addReview: async (reviewData: any) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.post(API.listReviews, reviewData);
      set({ loading: false });
      get().fetchReviews();
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to add review",
        loading: false,
      });
      throw error;
    }
  },

  updateReview: async (id: string, reviewData: any) => {
    try {
      set({ loading: true, error: null });
      const url = `${API.listReviews}/${id}`;
      await axiosInstance.put(url, reviewData);
      set({ loading: false });
      get().fetchReviews(get().page);
    } catch (error: any) {
      set({ loading: false, error: "Failed to update review" });
      throw error;
    }
  },

  updateReviewStatus: async (id: string, status: string) => {
    try {
      const url = `${API.toggleStatusReview}${id}`;

      await axiosInstance.put(url, { status });

      set((state: any) => ({
        reviews: state.reviews.map((r: any) =>
          r._id === id ? { ...r, status: status } : r,
        ),
      }));
    } catch (error: any) {
      console.error("Status update error:", error);
      throw error;
    }
  },

  toggleReviewStatus: async (id: string) => {
    try {
      const review = get().reviews.find((r) => r._id === id);
      if (!review) return;

      const newStatus = review.status === "active" ? "inactive" : "active";
      await get().updateReviewStatus(id, newStatus);
    } catch (error: any) {
      set({ error: "Failed to toggle status" });
      throw error;
    }
  },

  deleteReview: async (id: string, userId: string) => {
    try {
      set({ loading: true });
      const url = `${API.listReviews}/${id}`;

      await axiosInstance.delete(url, { data: { userId } });

      set((state) => ({
        reviews: state.reviews.filter((r: any) => r._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Delete failed",
        loading: false,
      });
      throw error;
    }
  },
}));
