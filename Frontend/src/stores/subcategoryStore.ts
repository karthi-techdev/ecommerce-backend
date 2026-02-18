import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { SubCategory } from "../types/common";
import ImportedURL from "../common/urls";
const { API } = ImportedURL;

interface SubCategoryStats {
  total: number;
  active: number;
  inactive: number;
}

interface SubCategoryState {
  subCategories: SubCategory[];
  trashSubCategories: SubCategory[];
  stats: SubCategoryStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;

  fetchSubCategories: (page?: number,limit?: number,filter?: "total" | "active" | "inactive") => Promise<void>;
  fetchActiveMainCategories: (page?: number, limit?: number,search?: string,isLoadMore?: boolean) => Promise<void>;
  fetchTrashSubCategories: ( page?: number, limit?: number) => Promise<void>;
  fetchSubCategoryById: ( id: string) => Promise<SubCategory | null>;
  addSubCategory: (data: FormData) => Promise<void>;
  updateSubCategory: (id: string, data: FormData) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
  restoreSubCategory: (id: string) => Promise<void>;
  hardDeleteSubCategory: (id: string) => Promise<void>;
  toggleStatusSubCategory: (id: string) => Promise<void>;
  checkDuplicateSubCategory: ( slug: string, mainCategoryId: string, excludeId?: string) => Promise<boolean>;
}

export const useSubCategoryStore = create<SubCategoryState>((set) => ({
  subCategories: [],
  trashSubCategories: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: false,

  checkDuplicateSubCategory: async ( slug,mainCategoryId, excludeId) => {
    try {
      const res = await axiosInstance.post(
        API.checkDuplicateSubCategory, { slug, mainCategoryId, excludeId }
      );
      return res.data.exists as boolean;
    } catch (error: any) {
      set({ error:error?.response?.data?.message || "Failed to check duplicate", });
      throw error;
    }
  },

  fetchSubCategories: async ( page = 1, limit = 10, filter = "total") => {
    try {
      set({ loading: true, error: null });
      const statusParam = filter === "active" ? "active": filter === "inactive" ? "inactive" : "";
      const res = await axiosInstance.get(
        `${API.listSubCategory}?page=${page}&limit=${limit}${  statusParam ? `&status=${statusParam}` : "" }`
      );
      const { data, meta } = res.data.data;
      set({
        subCategories: data || [],
        stats: {
          total: meta?.total ?? 0,
          active: meta?.active ?? 0,
          inactive: meta?.inactive ?? 0,
        },
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to fetch SubCategories",
      });
    }
  },

 fetchActiveMainCategories: async ( page = 1,limit = 5,search = " ") => {
  try {
    set({ loading: true, error: null });

    const res = await axiosInstance.get(
      `${API.listActiveMainCategory}?page=${page}&limit=${limit}${ search ? `&search=${search}` : "" }`
    );
    const { data = [], meta } = res.data.data;
    set((state) => ({
      subCategories:
        page === 1? data: [...state.subCategories, ...data],
      page: meta?.page ?? page,
      totalPages: meta?.totalPages ?? 1,
      hasMore: meta?.hasMore ?? false,
      loading: false,
    }));

  } catch (error: any) {
    set({
      loading: false,
      error: error?.response?.data?.message ||"Failed to fetch Active Main Categories",
    });
  }
},

  fetchSubCategoryById: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getSubCategoryById}${id}`);
      set({ loading: false });
      return res.data.data;
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message ||"Failed to fetch SubCategory",
      });
      return null;
    }
  },

  addSubCategory: async (formData) => {
    try {
      const res = await axiosInstance.post(
        API.addSubCategory,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      set((state) => ({
        subCategories: [ res.data.data, ...state.subCategories,],
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to add SubCategory",
      });
      throw error;
    }
  },

  updateSubCategory: async (id, formData) => {
    try {
      const res = await axiosInstance.put(`${API.updateSubCategory}${id}`,
        formData, { headers: { "Content-Type": "multipart/form-data" } } );
      set((state) => ({
        subCategories: state.subCategories.map((sc) =>
          sc._id === id ? res.data.data : sc
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||"Failed to update SubCategory",
      });
      throw error;
    }
  },

  deleteSubCategory: async (id) => {
    try {
      set({ error: null }); 
      await axiosInstance.delete(`${API.deleteSubCategory}${id}`);

      set((state) => ({
        subCategories: state.subCategories.filter((sc) => sc._id !== id),
      }));
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to delete SubCategory";
      set({ error: errMsg });
      throw error; 
    }
  },

  toggleStatusSubCategory: async (id) => {
    try {
      set({ error: null });
      const res = await axiosInstance.patch(`${API.toggleStatusSubCategory}${id}`);
      set((state) => ({
        subCategories: state.subCategories.map((sc) =>
          sc._id === id ? { ...sc, isActive: res.data.data.isActive } : sc
        ),
      }));
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to toggle status";
      set({ error: errMsg });
      throw error; 
    }
  },

  fetchTrashSubCategories: async ( page = 1, limit = 10 ) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get( `${API.listSubCategoryTrash}?page=${page}&limit=${limit}`);
      const { data, meta } = res.data.data;
      set({trashSubCategories: data || [], page, totalPages: meta?.totalPages ?? 1, loading: false,});
    } catch (error: any) {
      set({loading: false,
        error:error?.response?.data?.message || "Failed to fetch Trash SubCategories",
      });
    }
  },

  restoreSubCategory: async (id) => {
    try {
      await axiosInstance.patch(`${API.restoreSubCategory}${id}`);
      set((state) => ({
        trashSubCategories: state.trashSubCategories.filter( (sc) => sc._id !== id),
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message ||"Failed to restore SubCategory",
      });
    }
  },

  hardDeleteSubCategory: async (id) => {
    try {
      set({ error: null });
      await axiosInstance.delete(`${API.hardDeleteSubCategory}${id}`);

      set((state) => ({
        trashSubCategories: state.trashSubCategories.filter((sc) => sc._id !== id),
      }));
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Failed to delete permanently";
      set({ error: errMsg });
      throw error; 
    }
  },
}));