import { create } from "zustand";
import axiosInstance from '../components/utils/axios';
import ImportedURL from '../common/urls';
import type { Order } from "../types/common";

const { API } = ImportedURL;

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  paid: number;   // Added
  unpaid: number; // Added
  delivered: number;
  cancelled: number;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  stats: OrderStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;

  fetchOrders: (page?: number, limit?: number, status?: string, search?: string) => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: Order['orderStatus']) => Promise<void>; 
  updatePaymentStatus: (id: string, status: Order['paymentStatus']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({ 
  orders: [],
  currentOrder: null,
  stats: { total: 0, pending: 0, paid: 0, unpaid: 0 , processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

    fetchOrders: async (page = 1, limit = 20, status = '', search = '') => {
    try {
        set({ loading: true, error: null });

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(status && { status }),
            ...(search && { orderNumber: search })
        });

        const res = await axiosInstance.get(`${API.listOrder}?${params.toString()}`);
        
        const ordersArray = res.data?.data || [];
        const metaData = res.data?.meta || {};

        set({
            orders: ordersArray,
            stats: {
                total: metaData.total ?? ordersArray.length,
                // Change these to filter by paymentStatus instead of orderStatus
                paid: ordersArray.filter((o: any) => o.paymentStatus === 'Paid').length,
                unpaid: ordersArray.filter((o: any) => o.paymentStatus === 'Unpaid').length,
            },
            page,
            totalPages: metaData.totalPages ?? 1,
            loading: false
        });
        return ordersArray;
    } catch (error: any) {
        set({
            loading: false,
            error: error?.response?.data?.message || 'Failed to fetch orders'
        });
    }
},
    fetchOrderById: async (id: string) => {
        try {
        set({ loading: true, error: null });
        const res = await axiosInstance.get(`${API.getOrderById}${id}`);
        const orderData = res.data?.data;
        set({ currentOrder: orderData, loading: false });
        return orderData;
        } catch (error: any) {
        set({
            loading: false,
            error: error?.response?.data?.message || 'Failed to fetch order details'
        });
        return null;
        }
    },

    updateOrderStatus: async (id: string, status: Order['orderStatus']) => {
        try {
            set({ loading: true });
            await axiosInstance.put(`${API.updateOrderStatus}/${id}`, { status });
            set(state => ({
                orders: state.orders.map(o => o._id === id ? { ...o, orderStatus: status } : o),
                currentOrder: state.currentOrder?._id === id ? { ...state.currentOrder, orderStatus: status } : state.currentOrder,
                loading: false,
                error: null
            }));
            
        } catch (error: any) {
            set({
                loading: false,
                error: error?.response?.data?.message || 'Failed to update order status'
            });
            throw error;
        }
    }, 

    updatePaymentStatus: async (id: string, status: Order['paymentStatus']) => {
        try {
        await axiosInstance.patch(`${API.updatePaymentStatus}${id}/payment-status`, { status });
        
        set(state => ({
            orders: state.orders.map(o => o._id === id ? { ...o, paymentStatus: status } : o),
            currentOrder: state.currentOrder?._id === id ? { ...state.currentOrder, paymentStatus: status } : state.currentOrder,
            error: null
        }));
        } catch (error: any) {
        set({ error: error?.response?.data?.message || 'Failed to update payment status' });
        throw error;
        }
    },

    deleteOrder: async (id: string) => {
        try {
        await axiosInstance.delete(`${API.deleteOrder}${id}`);
        set(state => ({
            orders: state.orders.filter(o => o._id !== id),
            currentOrder: state.currentOrder?._id === id ? null : state.currentOrder,
            error: null
        }));
        } catch (error: any) {
        set({ error: error?.response?.data?.message || 'Failed to delete order' });
        throw error;
        }
    }
    }));