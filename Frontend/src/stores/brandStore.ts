import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { Brand } from "../types/common";
import ImportedURL from "../common/urls";

const { API } = ImportedURL;

interface BrandState {
  brands: Brand[];
  trashBrands: Brand[];
  loading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;
  totalBrands: number;
  totalActive: number;
  totalInactive: number;

  trashCurrentPage: number;
  trashTotalPages: number;
  totalTrashBrands: number;

  fetchBrands: (
    page?: number,
    limit?: number,
    filter?: "total" | "active" | "inactive"
  ) => Promise<void>;

  fetchTrashBrands: (page?: number, limit?: number) => Promise<void>;

  addBrand: (formData: FormData) => Promise<void>;
  updateBrand: (id: string, formData: FormData) => Promise<void>;
  softDeleteBrand: (id: string) => Promise<void>;
  restoreBrand: (id: string) => Promise<void>;
  hardDeleteBrand: (id: string) => Promise<void>;
  toggleBrandStatus: (id: string) => Promise<void>;
  checkBrandNameExists: (name: string, excludeId?: string) => boolean;
}

export const useBrandStore = create<BrandState>((set, get) => ({
  brands: [],
  trashBrands: [],
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalBrands: 0,
  totalActive: 0,
  totalInactive: 0,

  trashCurrentPage: 1,
  trashTotalPages: 1,
  totalTrashBrands: 0,

  // Fetch Brands
  fetchBrands: async (
    page = 1,
    limit = 10,
    filter: "total" | "active" | "inactive" = "total"
    
  ) => {
    try {
      set({ loading: true, error: null });

      const params: any = { page, limit };

      if (filter !== "total") params.status = filter;

      const res = await axiosInstance.get(API.listBrand, { params });

      const { data, meta, counts } = res.data;

      set({
        brands: data,
        currentPage: meta.page,
        totalPages: meta.totalPages,
        totalBrands: counts.totalBrands,
        totalActive: counts.totalActive,
        totalInactive: counts.totalInactive,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch brands",
        loading: false,
      });
    }
  },

  //Fetch Trash Brands
  fetchTrashBrands: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(API.trashBrands, {
        params: { page, limit },
      });

      const { data, meta } = res.data;

      set({
        trashBrands: data,
        trashCurrentPage: meta.page,
        trashTotalPages: meta.totalPages,
        totalTrashBrands: meta.total,
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch trash brands",
        loading: false,
      });
    }
  },

  // Add Brand
  addBrand: async (formData: FormData) => {
    try {
      await axiosInstance.post(API.addBrand, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchBrands(get().currentPage);
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to add brand",
      });
      throw error;
    }
  },

  //Update Brand
  updateBrand: async (id: string, formData: FormData) => {
    try {
      await axiosInstance.put(`${API.updateBrand}${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchBrands(get().currentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Failed to update brand",
      });
      throw error;
    }
  },

  //Soft Delete
  softDeleteBrand: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.softDeleteBrand}${id}`);

      await get().fetchBrands(get().currentPage);
      await get().fetchTrashBrands(get().trashCurrentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to move brand to trash",
      });
    }
  },

  //Restore Brand
  restoreBrand: async (id: string) => {
    try {
      await axiosInstance.patch(`${API.restoreBrand}/${id}`);

      await get().fetchBrands(get().currentPage);
      await get().fetchTrashBrands(get().trashCurrentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to restore brand",
      });
    }
  },

  // Hard Delete
  hardDeleteBrand: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.hardDeleteBrand}/${id}`);

      await get().fetchBrands(get().currentPage);
      await get().fetchTrashBrands(get().trashCurrentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to permanently delete brand",
      });
    }
  },

  //Toggle Status
  toggleBrandStatus: async (id: string) => {
    try {
      await axiosInstance.patch(`${API.toggleBrandStatus}/${id}`, {});
      await get().fetchBrands(get().currentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Failed to update status",
      });
      throw error;
    }
  },

  //  Duplicate Name Check
  checkBrandNameExists: (name: string, excludeId?: string) => {
    const brands = get().brands;

    return brands.some(
      (brand) =>
        brand.name.toLowerCase() === name.toLowerCase() &&
        brand._id !== excludeId
    );
  },
}));

