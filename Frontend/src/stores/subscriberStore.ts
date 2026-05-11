import { create } from "zustand";
import ImportedURL from "../common/urls";
import type { SubscriberFormData } from "../types/common";
import axiosInstance from "../components/utils/axios";

const { API } = ImportedURL;

interface subscriberStat {
  total: number;
  active: number;
  inactive: number;
}

interface subscriberStates {
  subscriber: SubscriberFormData[];
  page: number;
  currentPage: number;
  currentFilter: string; 
  stats: subscriberStat;
  error: string | null;
  loading: boolean;
  totalPages: number;

  addSubsciber: (data: FormData) => Promise<void>;
  fetchAllSubscriber: (
    page?: number,
    limit?: number,
    filter?: string
  ) => Promise<void>;
  DeleteSubscriber: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
}

export const useSubscriberStore = create<subscriberStates>((set, get) => ({
  subscriber: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,

  currentPage: 1,
  page: 1,
  totalPages: 1,
  currentFilter: "total", 

  fetchAllSubscriber: async (page = 1, limit = 10, filter = "total") => {
    try {
      set({ loading: true, error: null });

      const params: any = { page, limit };
      if (filter !== "total") params.filter = filter;

      const res = await axiosInstance.get(API.listSubScriber, { params });

      const { data, meta, counts } = res.data;

      set({
        subscriber: Array.isArray(data) ? data : [],
        stats: {
          total: counts?.totalSubscriber ?? 0,
          active: counts?.totalActive ?? 0,
          inactive: counts?.totalInactive ?? 0,
        },
        page,
        currentPage: page,
        currentFilter: filter,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
      });

    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscribers",
        loading: false,
      });
    }
  },

  
  addSubsciber: async (formData: FormData) => {
    try {
      const res = await axiosInstance.post(API.addSubScriber, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        subscriber: [...state.subscriber, res.data.data],
      }));

    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to add subscribers",
      });
      throw error;
    }
  },

 
  DeleteSubscriber: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.deleteSubScriber}/${id}`);

      await get().fetchAllSubscriber(
        get().currentPage,
        10,
        get().currentFilter 
      );

    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to permanently delete subscriber",
      });
    }
  },

  
  toggleStatus: async (id: string) => {
    try {
      await axiosInstance.patch(`${API.toggleSubScriber}/${id}`, {});

      await get().fetchAllSubscriber(
        get().currentPage,
        10,
        get().currentFilter 
      );

    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Failed to update status",
      });
      throw error;
    }
  },

}));