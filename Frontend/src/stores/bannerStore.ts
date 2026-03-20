import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { IBanner } from "../types/common";
import ImportedURL from "../common/urls";

const { API } = ImportedURL;

interface BannerState {
  banner: IBanner | null;
  loading: boolean;
  error: string | null;

  fetchBanner: () => Promise<void>;
  updateBanner: (id: string | null | undefined, formData: FormData) => Promise<IBanner | null>;
}

export const useBannerStore = create<BannerState>((set) => ({
  banner: null,
  loading: false,
  error: null,

  fetchBanner: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(API.listBanners);

      set({
        banner: res.data?.data || null,
        loading: false,
      });

    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to fetch banner",
      });
    }
  },

  updateBanner: async (id: string | null | undefined, formData: FormData) => {
    try {
      set({ loading: true, error: null });

      const url = id ? `${API.updateBanners}/${id}` :
        API.updateBanners;

      const res = await axiosInstance.put(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updated = res.data?.data;

      set({
        banner: updated,
        loading: false,
      });

      return updated;

    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to update banner",
      });
      throw error;
    }
  },
}));