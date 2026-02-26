import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import type { ShipmentMethod } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface ShipmentMethodStats {
  total: number;
  active: number;
  inactive: number;
}

interface ShipmentMethodState {
  shipmentMethods: ShipmentMethod[];
  stats: ShipmentMethodStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;

  fetchShipmentMethods: (page?: number, limit?: number,filter?: 'total' | 'active' | 'inactive') => Promise<void>;
  fetchShipmentMethodById: (id: string) => Promise<ShipmentMethod | null>;
  checkDuplicateSlug: (slug: string) => Promise<boolean>;
  addShipmentMethod: (data: ShipmentMethod) => Promise<void>;
  updateShipmentMethod: (id: string, data: ShipmentMethod) => Promise<void>;
  deleteShipmentMethod: (id: string) => Promise<void>;
  toggleStatusShipmentMethod: (id: string) => Promise<void>;
}

export const useShipmentMethodStore = create<ShipmentMethodState>((set, get) => ({
  shipmentMethods: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  checkDuplicateSlug: async (slug: string) => {
    try {
      const res = await axiosInstance.post(API.checkDuplicateShipmentMethods, { slug });
      return res.data.exists;
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || error?.message ||'Failed to check duplicate slug'
      });
      throw error;
    }
  },

  fetchShipmentMethods: async (page = 1, limit = 10, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam = filter === 'active'? 'active' : filter === 'inactive' ? 'inactive': '';
      const res = await axiosInstance.get(
        `${API.listShipmentMethods}?page=${page}&limit=${limit}${
          statusParam ? `&status=${statusParam}` : ''
        }`
      );
      const { data: shipmentData, meta } = res.data.data;
      set({
        shipmentMethods: Array.isArray(shipmentData) ? shipmentData : [],
        stats: {
          total: meta?.total ?? 0,
          active: meta?.active ?? 0,
          inactive: meta?.inactive ?? 0
        },
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error:
          error?.message === 'Network error'
            ? 'Network error'
            : error?.response?.data?.message ||
              error?.message ||
              'Failed to fetch shipment methods',
        shipmentMethods: [],
        stats: { total: 0, active: 0, inactive: 0 },
        loading: false
      });
    }
  },

  fetchShipmentMethodById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getShipmentMethodsById}${id}`);
      const method = res.data.data;
      set((state) => ({
        shipmentMethods: state.shipmentMethods.some(m => m._id === id)
          ? state.shipmentMethods.map(m => m._id === id ? method : m )
          : [...state.shipmentMethods, method],
        loading: false
      }));
      return method;
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || error?.message || 'Failed to fetch shipment method',
        loading: false
      });
      return null;
    }
  },

  addShipmentMethod: async (data: ShipmentMethod) => {
    try {
      const store = get();
      const isDuplicate = await store.checkDuplicateSlug(data.slug);
      if (isDuplicate) {
        throw new Error('Shipment method with this slug already exists');
      }
      const res = await axiosInstance.post(API.addShipmentMethods, data);
      set((state) => ({
        shipmentMethods: [...state.shipmentMethods, res.data.data],
        error: null
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||error?.message || 'Failed to add shipment method'
      });
      throw error?.response?.data?.message || error?.message || error;
    }
  },

  updateShipmentMethod: async (id: string, data: ShipmentMethod) => {
  try {
    const payload = {...data,price: Number(data.price)};
    const res = await axiosInstance.put(`${API.updateShipmentMethods}${id}`, payload);
    set((state) => ({
      shipmentMethods: state.shipmentMethods.map(m =>
        m._id === id ? { ...m, ...res.data.data } : m
      ),
      error: null
    }));

  } catch (error: any) {
    set({
      error: error?.response?.data?.message ||error?.message ||'Failed to update shipment method'
    });
    throw error?.response?.data?.message || error?.message || error;
  }
},


  deleteShipmentMethod: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.deleteShipmentMethods}${id}`);
      set((state) => ({
        shipmentMethods: state.shipmentMethods.filter(m => m._id !== id),
        error: null
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || error?.message ||'Failed to delete shipment method'
      });
    }
  },

  toggleStatusShipmentMethod: async (id: string) => {
    try {
      const res = await axiosInstance.patch(
        `${API.toggleStatusShipmentMethods}${id}`
      );
      set((state) => ({
        shipmentMethods: state.shipmentMethods.map(m => {
          if (m._id === id) {
            return { ...m, status: res.data.data.status };
          }
          return m;
        }),
        error: null
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || error?.message || 'Failed to toggle status'
      });
    }
  }
}));
