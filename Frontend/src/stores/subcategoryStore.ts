import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import type { SubCategory } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

/* ---------- TYPES ---------- */
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

  fetchSubCategories: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;

  fetchTrashSubCategories: (page?: number, limit?: number) => Promise<void>;
  fetchSubCategoryById: (id: string) => Promise<SubCategory | null>;
  addSubCategory: (data: FormData) => Promise<void>;
  updateSubCategory: (id: string, data: FormData) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>; 
  restoreSubCategory: (id: string) => Promise<void>;
  hardDeleteSubCategory: (id: string) => Promise<void>;
  checkDuplicateSubCategory: (slug: string,mainCategoryId: string,excludeId?: string) => Promise<boolean>;
  toggleStatusSubCategory: (id: string) => Promise<void>;
}

export const useSubCategoryStore = create<SubCategoryState>((set) => ({
  subCategories: [],
  trashSubCategories: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  
  checkDuplicateSubCategory: async (
  slug: string,
  mainCategoryId: string,
  excludeId?: string
) => {
  try {
    const res = await axiosInstance.post(
      API.checkDuplicateSubCategory,
      {
        slug,
        mainCategoryId,
        excludeId,
      }
    );

    return res.data.exists as boolean;
  } catch (error: any) {
    set({
      error:
        error?.response?.data?.message ||
        'Failed to check for duplicate subcategory',
    });
    throw error;
  }
},

  fetchSubCategories: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });

      const statusParam =
        filter === 'active'
          ? 'active'
          : filter === 'inactive'
          ? 'inactive'
          : '';

      const res = await axiosInstance.get(
        `${API.listSubCategory}?page=${page}&limit=${limit}${
          statusParam ? `&status=${statusParam}` : ''
        }`
      );

      const { data, meta } = res.data.data;

      set({
        subCategories: data || [],
        stats: {
          total: meta?.total ?? 0,
          active: meta?.active ?? 0,
          inactive: meta?.inactive ?? 0
        },
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false
      });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          'Failed to fetch SubCategories'
      });
    }
  },

  fetchSubCategoryById: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(
        `${API.getSubCategoryById}${id}`
      );

      set({ loading: false });
      return res.data.data;
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          'Failed to fetch SubCategory'
      });
      return null;
    }
  },

  addSubCategory: async (formData: FormData) => {
    try {
      const res = await axiosInstance.post(
        API.addSubCategory,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      set(state => ({
        subCategories: [...state.subCategories, res.data.data],
        error: null
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to add SubCategory'
      });
      throw error;
    }
  },

  updateSubCategory: async (id: string, formData: FormData) => {
    try {
      const res = await axiosInstance.put(
        `${API.updateSubCategory}${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      set(state => ({
        subCategories: state.subCategories.map(sc =>
          sc._id === id ? res.data.data : sc
        ),
        error: null
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to update SubCategory'
      });
      throw error;
    }
  },

  deleteSubCategory: async (id: string) => {
    try {
      await axiosInstance.delete(
        `${API.deleteSubCategory}${id}`
      );

      set(state => ({
        subCategories: state.subCategories.filter(
          sc => sc._id !== id
        ),
        error: null
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to delete SubCategory'
      });
    }
  },

  toggleStatusSubCategory: async (id: string) => {
    try {
      const res = await axiosInstance.patch(
        `${API.toggleStatusSubCategory}${id}`
      );

      set(state => ({
        subCategories: state.subCategories.map(sc =>
          sc._id === id
            ? { ...sc, isActive: res.data.data.isActive }
            : sc
        ),
        error: null
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to toggle status'
      });
    }
  },

  fetchTrashSubCategories: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(
        `${API.listSubCategoryTrash}?page=${page}&limit=${limit}`
      );

      const { data, meta } = res.data.data;

      set({
        trashSubCategories: data || [],
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false
      });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          'Failed to fetch Trash SubCategories'
      });
    }
  },

  restoreSubCategory: async (id: string) => {
    try {
      await axiosInstance.patch(
        `${API.restoreSubCategory}${id}`
      );

      set(state => ({
        trashSubCategories: state.trashSubCategories.filter(
          sc => sc._id !== id
        ),
        error: null
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to restore SubCategory'
      });
    }
  },

  hardDeleteSubCategory: async (id: string) => {
    try {
      await axiosInstance.delete(
        `${API.hardDeleteSubCategory}${id}`
      );

      set(state => ({
        trashSubCategories: state.trashSubCategories.filter(
          sc => sc._id !== id
        ),
        error: null
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to delete permanently'
      });
    }
  }
}));
