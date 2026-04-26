import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import type { AddInfo } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface AddInfoStats {
  total: number;
  active: number;
  inactive: number;
}

interface AddInfoState {
  addInfos: AddInfo[];
  stats: AddInfoStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;

  fetchAddInfos: (page?: number, limit?: number, filter?: string) => Promise<void>;
  fetchAddInfoById: (id: string) => Promise<AddInfo | null>;
  checkDuplicateKey: (key: string, excludeId?: string) => Promise<boolean>;
  addAddInfo: (info: AddInfo) => Promise<void>;
  updateAddInfo: (id: string, info: AddInfo) => Promise<void>;
  softDeleteAddInfo: (id: string) => Promise<void>;
  restoreAddInfo: (id: string) => Promise<void>;
  getAddInfoStats: () => Promise<void>;
  toggleStatusAddInfo:(id: string) => Promise<void>;
}

export const useAddInfoStore = create<AddInfoState>((set, get) => ({
  addInfos: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  // ✅ Fetch with filter (IMPORTANT)
  fetchAddInfos: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(
        `${API.listAddInfos}?page=${page}&limit=${limit}&filter=${filter}`
      );

      const { data, meta } = res.data.data;

      set({
        addInfos: Array.isArray(data) ? data : [],
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
        error: error?.message || 'Failed to fetch Additional Info',
        addInfos: [],
        loading: false,
      });
    }
  },

  fetchAddInfoById: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(`${API.getAddInfo}${id}`);
      const info = res.data.data;

      set((state) => ({
        addInfos: state.addInfos.some((i) => i._id === id)
          ? state.addInfos.map((i) => (i._id === id ? info : i))
          : [...state.addInfos, info],
        loading: false,
      }));

      return info;
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch record',
        loading: false,
      });
      return null;
    }
  },

  getAddInfoStats: async () => {
    try {
      const res = await axiosInstance.get(`${API.addInfoStats}`);

      set({
        stats: {
          total: res.data.data.total,
          active: res.data.data.active,
          inactive: res.data.data.inactive,
        },
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to load stats',
      });
    }
  },

  checkDuplicateKey: async (key: string, excludeId?: string) => {
    try {
      const res = await axiosInstance.post(`${API.checkDuplicateAddInfo}`, {
        key,
        excludeId,
      });
      return res.data.exists;
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to check for duplicate key',
      });
      throw error;
    }
  },

  addAddInfo: async (info: AddInfo) => {
    try {
      const store = get();

      const isDuplicate = await store.checkDuplicateKey(info.key);
      if (isDuplicate) throw new Error('This key already exists');

      const res = await axiosInstance.post(API.addAddInfo, info);

      set((state) => ({
        addInfos: [res.data.data, ...state.addInfos],
      }));

      await get().getAddInfoStats();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add record';
      set({ error: msg });
      throw msg;
    }
  },

  updateAddInfo: async (id: string, info: AddInfo) => {
    try {
      const store = get();

      const isDuplicate = await store.checkDuplicateKey(info.key, id);
      if (isDuplicate) throw new Error('This key already exists');

      const res = await axiosInstance.put(
        `${API.updateAddInfo}${id}`,
        info
      );

      set((state) => ({
        addInfos: state.addInfos.map((i) =>
          i._id === id ? { ...i, ...res.data.data } : i
        ),
      }));

      await get().getAddInfoStats();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update record';
      set({ error: msg });
      throw msg;
    }
  },

  // ✅ Soft delete → mark as inactive
  softDeleteAddInfo: async (id: string) => {
  try {
    const res = await axiosInstance.patch(`${API.softDeleteAddInfo}${id}`);
    const updated = res.data.data;

    set((state) => ({
      addInfos: state.addInfos.map((i) =>
        i._id === id ? { ...i, isDeleted: true } : i
      ),
      stats: {
        ...state.stats,
        active: state.stats.active - 1,
        inactive: state.stats.inactive + 1,
      },
      error: null,
    }));
  } catch (error: any) {
    set({
      error:
        error?.response?.data?.message ||
        'Failed to deactivate record',
    });
  }
},

  // ✅ Restore → back to active
restoreAddInfo: async (id: string) => {
  try {
    const res = await axiosInstance.patch(`${API.restoreAddInfo}${id}`);
    const updated = res.data.data;

    set((state) => ({
      addInfos: state.addInfos.map((i) =>
        i._id === id ? { ...i, isDeleted: false } : i
      ),
      stats: {
        ...state.stats,
        active: state.stats.active + 1,
        inactive: state.stats.inactive - 1,
      },
      error: null,
    }));
  } catch (error: any) {
    set({
      error:
        error?.response?.data?.message ||
        'Failed to restore record',
    });
  }
},

toggleStatusAddInfo: async (id: string) => {
  try {
    const res = await axiosInstance.patch(`${API.toggleAddInfo}${id}`);

    set((state) => ({
      addInfos: state.addInfos.map((i) =>
        i._id === id
          ? { ...i, isActive: res.data.data.isActive }
          : i
      ),
    }));
  } catch (error: any) {
    set({
      error: error?.response?.data?.message || 'Failed to toggle status',
    });
  }
}
}));