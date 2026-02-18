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

  fetchTrashedMainCategories: (
  page?: number,
  limit?: number
) => Promise<void>;



  fetchMainCategories: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  checkMainCategoryNameExists: (name: string, id?: string) => Promise<boolean>;
  fetchMainCategoryById: (id: string) => Promise<MainCategory | null>;
  addMainCategory: (category: MainCategory | FormData) => Promise<void>;
  updateMainCategory: (id: string, category: MainCategory | FormData) => Promise<void>;
  deleteMainCategory: (id: string) => Promise<void>;
  toggleMainCategoryStatus: (id: string) => Promise<void>;
  restoreMainCategory: (id: string) => Promise<void>;
permanentDeleteMainCategory: (id: string) => Promise<void>;
}

export const useMainCategoryStore = create<MainCategoryState>((set) => ({
  mainCategories: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchMainCategories: async (page = 1, limit = 20, filter = 'total') => {
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
        error: 'Failed to fetch mainCategories',
        mainCategories: [],
        loading: false,
      });
    }
  },
  fetchTrashedMainCategories: async (page = 1, limit = 20) => {
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
checkMainCategoryNameExists: async (name: string, id?: string) => {
  const res = await axiosInstance.get(
    `${API.listMainCategory}/check-name`,
    { params: { name, id } }
  );
  return res.data.exists;
},

restoreMainCategory: async (id: string) => {
  await axiosInstance.patch(`${API.restoreMainCategory}${id}`);
},

permanentDeleteMainCategory: async (id: string) => {
  await axiosInstance.delete(
    `${API.permanentDeleteMainCategory}${id}`
  );
},

  
  deleteMainCategory: async (id: string) => {
    await axiosInstance.delete(`${API.deleteMainCategory}${id}`);
  },


  toggleMainCategoryStatus: async (id: string) => {
  set((state) => ({
    mainCategories: state.mainCategories.map((cat) =>
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


  fetchMainCategoryById: async (id: string) => {
    try {
      const res = await axiosInstance.get(`${API.getMainCategory}${id}`);
      return res.data?.data || null;
    } catch {
      return null;
    }
  },

  addMainCategory: async (mainCategory) => {
    await axiosInstance.post(API.addMainCategory, mainCategory);
  },

  updateMainCategory: async (id, mainCategory) => {
    await axiosInstance.put(`${API.updateMainCategory}${id}`, mainCategory);
  },
}));






