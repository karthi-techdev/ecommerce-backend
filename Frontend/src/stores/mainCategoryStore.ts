import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import type { MainCategory } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface MainCategoryStats {
  total: number;
  active: number;
  inactive: number;
}

interface MainCategoryState {
  mainCategories: MainCategory[];
  stats: MainCategoryStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;

  fetchTrashedCategories: (
  page?: number,
  limit?: number
) => Promise<void>;



  fetchCategories: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  checkCategoryNameExists: (name: string, id?: string) => Promise<boolean>;
  fetchCategoryById: (id: string) => Promise<MainCategory | null>;
  addCategory: (category: MainCategory | FormData) => Promise<void>;
  updateCategory: (id: string, category: MainCategory | FormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategoryStatus: (id: string) => Promise<void>;
  restoreCategory: (id: string) => Promise<void>;
permanentDeleteCategory: (id: string) => Promise<void>;
}

export const useMainCategoryStore = create<MainCategoryState>((set) => ({
  mainCategories: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchCategories: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });

      const statusParam =
        filter === 'active'
          ? 'true'
          : filter === 'inactive'
          ? 'false'
          : '';

      const res = await axiosInstance.get(
        `${API.listMainCategory}?page=${page}&limit=${limit}${
          statusParam ? `&isActive=${statusParam}` : ''
        }`
      );

      const mainCategories = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const meta = res.data?.meta || {};

      set({
        mainCategories,
        stats: {
          total: meta.total ?? mainCategories.length,
          active:meta.active ??mainCategories.filter((c: MainCategory) => c.isActive).length,
          inactive:meta.inactive ??mainCategories.filter((c: MainCategory) => !c.isActive).length,
        },
        page,
        totalPages: Math.ceil((meta.total ?? mainCategories.length) / limit),
        loading: false,
      });
    } catch (error: any) {
      set({
        error: 'Failed to fetch categories',
        mainCategories: [],
        loading: false,
      });
    }
  },

  fetchTrashedCategories: async (page = 1, limit = 20) => {
  const res = await axiosInstance.get(
    `${API.getTrashMainCategory}?page=${page}&limit=${limit}`
  );

  set({
    mainCategories: res.data?.data ?? [],
    totalPages: Math.ceil(
  (res.data?.meta?.total ?? (res.data?.data?.length ?? 0)) / limit
),

  });
},
checkCategoryNameExists: async (name: string, id?: string) => {
  const res = await axiosInstance.get(
    `${API.listMainCategory}/check-name`,
    { params: { name, id } }
  );
  return res.data.exists;
},

restoreCategory: async (id: string) => {
  await axiosInstance.patch(`${API.restoreMainCategory}${id}`);
},

permanentDeleteCategory: async (id: string) => {
  await axiosInstance.delete(
    `${API.permanentDeleteMainCategory}${id}`
  );
},

  
  deleteCategory: async (id: string) => {
    await axiosInstance.delete(`${API.deleteMainCategory}${id}`);
  },


  toggleCategoryStatus: async (id: string) => {
  set((state) => ({
    categories: state.mainCategories.map((cat) =>
      cat._id === id
        ? { ...cat, isActive: !cat.isActive }
        : cat
    ),
    stats: {
      total: state.stats.total,
      active: state.mainCategories.filter(
        (c) =>
          c._id === id ? !c.isActive : c.isActive
      ).length,
      inactive: state.mainCategories.filter(
        (c) =>
          c._id === id ? c.isActive : !c.isActive
      ).length,
    },
  }));
  await axiosInstance.patch(
    `${API.toggleMainCategoryStatus}${id}`
  );
},


  fetchCategoryById: async (id: string) => {
    try {
      const res = await axiosInstance.get(`${API.getMainCategory}${id}`);
      return res.data?.data || null;
    } catch {
      return null;
    }
  },

  addCategory: async (category) => {
    await axiosInstance.post(API.addMainCategory, category);
  },

  updateCategory: async (id, category) => {
    await axiosInstance.put(`${API.updateMainCategory}${id}`, category);
  },
}));

