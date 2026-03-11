import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { Promotions } from "../types/common";
import ImportedURL from "../common/urls";

const { API } = ImportedURL;

interface PromotionsStats {
  total: number;
  active: number;
  inactive: number;
}

interface PromotionsState {
  promotions: Promotions[];
  trashPromotions: Promotions[];
  stats: PromotionsStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchPromotions: (
    page?: number,
    limit?: number,
    filter?: "total" | "active" | "inactive",
  ) => Promise<void>;
  fetchPromotionsById: (id: string) => Promise<Promotions | null>;
  checkDuplicatePromotions: (
    name: string,
    excludeId?: string,
  ) => Promise<boolean>;
  addPromotions: (promotions: Promotions) => Promise<void>;
  updatePromotions: (id: string, promotions: Promotions) => Promise<void>;
  softDeletePromotions: (id: string) => Promise<void>;
  permanantDeletePromotions: (id: string) => Promise<void>;
  toggleStatusPromotions: (id: string) => Promise<void>;
  fetchTrashPromotions: (page?: number, limit?: number) => Promise<void>;
  restorePromotions: (id: string) => Promise<void>;
  promotionsStats: () => Promise<void>;
}

export const usePromotionsStore = create<PromotionsState>((set, get) => ({
  promotions: [],
  trashPromotions: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  checkDuplicatePromotions: async (name: string, excludeId?: string) => {
    try {
      const res = await axiosInstance.post(API.checkDuplicatePromotions, {
        name,
        excludeId,
      });

      return res?.data?.exists ?? false;
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to check duplicate promotions",
      });
      return false;
    }
  },

  fetchPromotions: async (page = 1, limit = 20, filter = "total") => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === "active"
          ? "active"
          : filter === "inactive"
            ? "inactive"
            : "";
      const res = await axiosInstance.get(
        `${API.listPromotions}?page=${page}&limit=${limit}${
          statusParam ? `&status=${statusParam}` : ""
        }`,
      );
      const promotionsData = res?.data?.data?.data || [];
      const meta = res?.data?.data?.meta || {};

      const activeCount = promotionsData.filter((p: any) => p.isActive).length;
      const inactiveCount = promotionsData.filter(
        (p: any) => !p.isActive,
      ).length;
      set({
        promotions: Array.isArray(promotionsData) ? promotionsData : [],
        stats: {
          total: promotionsData.length,
          active: activeCount,
          inactive: inactiveCount,
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
              "Failed to fetch Promotions",
        promotions: [],
        stats: { total: 0, active: 0, inactive: 0 },
        loading: false,
      });
    }
  },

  fetchPromotionsById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getPromotions}${id}`);
      const promotions = res.data.data;
      set((state) => ({
        promotions: state.promotions.some((f) => f._id === id)
          ? state.promotions.map((f) => (f._id === id ? promotions : f))
          : [...state.promotions, promotions],
        loading: false,
      }));
      return promotions;
    } catch (error: any) {
      set({
        error:
          error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch Promotions",
        loading: false,
      });
      return null;
    }
  },
  promotionsStats: async () => {
    // try {
    //   const res = await axiosInstance.get(API.promotionsStats);
    //   set({
    //     stats: {
    //       total: res.data.data.total,
    //       active: res.data.data.active,
    //       inactive: res.data.data.inactive,
    //     },
    //   });
    // } catch (error: any) {
    //   set({
    //     error:
    //       error?.message === "Network error"
    //         ? "Network error"
    //         : error?.message ||
    //           error?.response?.data?.message ||
    //           "Failed to fetch Promotions",
    //     promotions: [], //
    //     stats: { total: 0, active: 0, inactive: 0 },
    //     loading: false,
    //   });
    // }
  },
  addPromotions: async (promotions: Promotions) => {
    try {
      // Check for duplicate Promotions before adding
      // const store = get();
      // const isDuplicate = await store.checkDuplicatePromotions(promotions.name);

      // console.log(isDuplicate, "im");
      // if (isDuplicate) {
      //   throw new Error("A Promotions with this name already exists");
      // }

      const res = await axiosInstance.post(API.addPromotions, promotions, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        promotions: [...state.promotions, res.data.data],
        error: null,
      }));
    } catch (error: any) {
      set({
        error:
          error?.message === "Network error"
            ? "Network error"
            : error?.response?.data?.message ||
              error?.message ||
              "Failed to add Promotions",
      });
      throw error?.response?.data?.message || error?.message || error;
    }
  },

  updatePromotions: async (id: string, promotions: Promotions) => {
    try {
      // Check for duplicate Promotions before updating, excluding the current Promotions
      const store = get();
      const isDuplicate = await store.checkDuplicatePromotions(
        promotions.name,
        id,
      );
      if (isDuplicate) {
        throw new Error("A Promotions with this name already exists");
      }

      const res = await axiosInstance.put(
        `${API.updatePromotions}${id}`,
        promotions,
      );
      set((state) => ({
        promotions: state.promotions.map((f) =>
          f._id === id ? { ...f, ...res.data.data } : f,
        ),
        error: null,
      }));
    } catch (error: any) {
      set({
        error:
          error?.message === "Network error"
            ? "Network error"
            : error?.response?.data?.message ||
              error?.message ||
              "Failed to update Promotions",
      });
      throw error?.response?.data?.message || error?.message || error;
    }
  },

  softDeletePromotions: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.softDeletePromotions}${id}`);
      set((state) => ({
        promotions: state.promotions.filter((f) => f._id !== id),
        error: null,
      }));
    } catch (error: any) {
      set({
        error:
          error?.message === "Network error"
            ? "Network error"
            : error?.message ||
              error?.response?.data?.message ||
              "Failed to delete Promotions",
      });
    }
  },

  permanantDeletePromotions: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.permanantDeletePromotions}${id}`);
      set((state) => ({
        promotions: state.promotions.filter((f) => f._id !== id),
        error: null,
      }));
    } catch (error: any) {
      set({
        error:
          error?.message === "Network error"
            ? "Network error"
            : error?.message ||
              error?.response?.data?.message ||
              "Failed to delete Promotions",
      });
    }
  },
  restorePromotions: async (id: string) => {
    try {
      await axiosInstance.patch(`${API.restorePromotions}${id}`);

      set((state) => ({
        trashPromotions: state.trashPromotions.filter((sc) => sc._id !== id),
        error: null,
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to restore Promotions",
      });
    }
  },
  toggleStatusPromotions: async (id: string) => {
    try {
      const promotion = get().promotions.find((p) => p._id === id);

      const res = await axiosInstance.put(`${API.updatePromotions}${id}`, {
        isActive: !promotion?.isActive,
      });

      set((state) => ({
        promotions: state.promotions.map((p) =>
          p._id === id ? { ...p, isActive: res.data.data.isActive } : p,
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.message ||
          error?.response?.data?.message ||
          "Failed to toggle status",
      });
    }
  },

  fetchTrashPromotions: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(
        `${API.trashPromotions}?page=${page}&limit=${limit}`,
      );
      const { data, meta } = res.data.data;
      set({
        trashPromotions: data || [],
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || "Failed to fetch Trash Promotions",
      });
    }
  },
}));
