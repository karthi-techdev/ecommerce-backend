import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import ImportedURL from '../common/urls';
const { API } = ImportedURL;

export interface ShipmentMethod {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  estimatedDeliveryTime: string;
  status: 'active' | 'inactive';
}

interface ShipmentStats {
  total: number;
  active: number;
  inactive: number;
}

interface ShipmentState {
  shipmentMethods: ShipmentMethod[];
  stats: ShipmentStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  
  fetchShipmentMethods: (page?: number,limit?: number,filter?: 'active' | 'inactive' | 'all') => Promise<void>;
  fetchShipmentMethodById: (id: string) => Promise<ShipmentMethod | null>;
  checkDuplicateSlug: (slug: string) => Promise<boolean>;
  addShipmentMethod: (method: ShipmentMethod) => Promise<void>;
  updateShipmentMethod: (id: string, method: Partial<ShipmentMethod>) => Promise<void>;
  deleteShipmentMethod: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
}

export const useShipmentStore = create<ShipmentState>((set) => ({
  shipmentMethods: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  checkDuplicateSlug: async (slug: string) => {
    try {
      const res = await axiosInstance.post(`${API.checkDuplicateShipmentMethods}`, { slug });
      return res.data.exists; // Returns boolean based on your controller
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to check slug' });
      return false;
    }
  },

  fetchShipmentMethods: async (page = 1, limit = 10, filter = 'all') => {
    try {
      set({ loading: true, error: null });
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      
      const res = await axiosInstance.get(
        `${API.listShipmentMethods}?page=${page}&limit=${limit}${statusParam}`
      );
      
      const { data: methodData, meta } = res.data.data;

      set({
        shipmentMethods: Array.isArray(methodData) ? methodData : [],
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
        error: error?.response?.data?.message || 'Failed to fetch shipment methods',
        loading: false,
        shipmentMethods: []
      });
    }
  },

  fetchShipmentMethodById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getShipmentMethodsById}${id}`);
      const method = res.data.data;
      
      set((state) => ({
        methods: state.shipmentMethods.some(m => m._id === id)
          ? state.shipmentMethods.map(m => m._id === id ? method : m)
          : [...state.shipmentMethods, method],
        loading: false,
      }));
      return method;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Method not found', loading: false });
      return null;
    }
  },

  addShipmentMethod: async (method: ShipmentMethod) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post(API.addShipmentMethods, method);
      
      set((state) => ({
        methods: [...state.shipmentMethods, res.data.data],
        loading: false
      }));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to create shipment method';
      set({ error: msg, loading: false });
      throw msg;
    }
  },

  updateShipmentMethod: async (id: string, method: Partial<ShipmentMethod>) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.put(`${API.updateShipmentMethods}${id}`, method);
      
      set((state) => ({
        methods: state.shipmentMethods.map(m => (m._id === id ? res.data.data : m)),
        loading: false
      }));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update shipment method';
      set({ error: msg, loading: false });
      throw msg;
    }
  },

  deleteShipmentMethod: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.deleteShipmentMethods}${id}`);
      set((state) => ({
        methods: state.shipmentMethods.filter(m => m._id !== id),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to delete method' });
    }
  },

  toggleStatus: async (id: string) => {
    try {
      const res = await axiosInstance.patch(`${API.toggleStatusShipmentMethods}${id}`);
      set((state) => ({
        methods: state.shipmentMethods.map(m => 
          m._id === id ? { ...m, status: res.data.data.status } : m
        ),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to toggle status' });
    }
  }
}));