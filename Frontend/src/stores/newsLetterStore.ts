import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { NewsLetter } from "../types/common";
import ImportedURL from "../common/urls";

const { API } = ImportedURL;

interface NewsLetterStats {
  total: number;
  active: number;
  inactive: number;
}

interface NewsLetterState {
  newsLetters: NewsLetter[];
  stats: NewsLetterStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchNewsLetters: (page?: number, limit?: number) => Promise<void>;
  fetchNewsLetterById: (id: string) => Promise<NewsLetter | null>;
  addNewsLetter: (newsLetter: any) => Promise<void>; // Changed to any for FormData
  updateNewsLetter: (id: string, newsLetter: any) => Promise<void>; // Changed to any for FormData
  deleteNewsLetter: (id: string) => Promise<void>;
}

export const useNewsLetterStore = create<NewsLetterState>((set) => ({
  newsLetters: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchNewsLetters: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(
        `${API.listNewsLetter}?page=${page}&limit=${limit}`,
      );
      const { data: newsLetterData, meta } = res.data.data;
      set({
        newsLetters: Array.isArray(newsLetterData) ? newsLetterData : [],
        stats: {
          total: meta?.total ?? 0,
          active: meta?.active ?? 0,
          inactive: meta?.inactive ?? 0,
        },
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error:
          error?.message === "Network error"
            ? "Network error"
            : error?.message ||
              error?.response?.data?.message ||
              "Failed to fetch NewsLetters",
        newsLetters: [],
        stats: { total: 0, active: 0, inactive: 0 },
        loading: false,
      });
    }
  },

  fetchNewsLetterById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getNewsLetter}${id}`);
      const newsLetter = res.data.data;
      set((state) => ({
        newsLetters: state.newsLetters.some((f) => f._id === id)
          ? state.newsLetters.map((f) => (f._id === id ? newsLetter : f))
          : [...state.newsLetters, newsLetter],
        loading: false,
      }));
      return newsLetter;
    } catch (error: any) {
      set({
        error:
          error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch NewsLetter",
        loading: false,
      });
      return null;
    }
  },

  addNewsLetter: async (newsLetter: any) => {
    try {
      const res = await axiosInstance.post(API.addNewsLetter, newsLetter, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        newsLetters: [...state.newsLetters, res.data.data],
        error: null,
      }));
    } catch (error: any) {
      set({
        error:
          error?.message === "Network error"
            ? "Network error"
            : error?.response?.data?.message ||
              error?.message ||
              "Failed to add NewsLetter",
      });
      throw error?.response?.data?.message || error?.message || error;
    }
  },

  updateNewsLetter: async (id: string, newsLetter: any) => {
    try {
      const res = await axiosInstance.put(
        `${API.updateNewsLetter}${id}`,
        newsLetter,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      //  Backend response-la irunthu vara puthu data (image path oda)
      const updatedData = res.data.data;

      set((state) => ({
        newsLetters: state.newsLetters.map((f) =>
          f._id === id ? { ...f, ...updatedData } : f,
        ),
        error: null,
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update NewsLetter",
      });
      throw error;
    }
  },

  deleteNewsLetter: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.deleteNewsLetter}${id}`);
      set((state) => ({
        newsLetters: state.newsLetters.filter((f) => f._id !== id),
        error: null,
      }));
    } catch (error: any) {
      set({ error: error?.message || "Failed to delete NewsLetter" });
    }
  },
}));
