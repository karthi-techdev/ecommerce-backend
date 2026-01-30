import { create } from 'zustand';
import axiosInstance from '../utils/axios';
import type { Faq } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface FaqStats {
  total: number;
  active: number;
  inactive: number;
}

interface FaqState {
  faqs: Faq[];
  stats: FaqStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchFaqs: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  fetchFaqById: (id: string) => Promise<Faq | null>;
  checkDuplicateFaq: (question: string, excludeId?: string) => Promise<boolean>;
  addFaq: (faq: Faq) => Promise<void>;
  updateFaq: (id: string, faq: Faq) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  toggleStatusFaq: (id: string) => Promise<void>;
}



export const useFaqStore = create<FaqState>((set, get) => ({
  faqs: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  checkDuplicateFaq: async (question: string, excludeId?: string) => {
    try {
      const res = await axiosInstance.post(`${API.checkDuplicateFaq}`, {
        question,
        excludeId // Optional ID to exclude from duplicate check (used when updating)
      });
      return res.data.exists;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to check for duplicate FAQ' });
      throw error;
    }
  },

  fetchFaqs: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
          filter === 'inactive' ? 'inactive' : '';
      const res = await axiosInstance.get(`${API.listfaq}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      const { data: faqData, meta } = res.data.data;
      set({
        faqs: Array.isArray(faqData) ? faqData : [],
        stats: {
          total: meta?.total ?? 0,
          active: meta?.active ?? 0,
          inactive: meta?.inactive ?? 0,
        },
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error?.message === 'Network error' ? 'Network error' : error?.message || error?.response?.data?.message || 'Failed to fetch FAQs',
        faqs: [],
        stats: { total: 0, active: 0, inactive: 0 },
        loading: false
      });
    }
  },

  fetchFaqById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getFaq}${id}`);
      const faq = res.data.data;
      set((state) => ({
        faqs: state.faqs.some(f => f._id === id)
          ? state.faqs.map(f => f._id === id ? faq : f)
          : [...state.faqs, faq],
        loading: false,
      }));
      return faq;
    } catch (error: any) {
      set({ error: error?.message || error?.response?.data?.message || 'Failed to fetch FAQ', loading: false });
      return null;
    }
  },

  addFaq: async (faq: Faq) => {
    try {
      // Check for duplicate FAQ before adding
      const store = get();
      const isDuplicate = await store.checkDuplicateFaq(faq.question);
      if (isDuplicate) {
        throw new Error('A FAQ with this question already exists');
      }

      const res = await axiosInstance.post(API.addfaq, faq);
      set((state) => ({
        faqs: [...state.faqs, res.data.data],
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.message === 'Network error' ? 'Network error' : error?.response?.data?.message || error?.message || 'Failed to add FAQ' });
      throw error?.response?.data?.message || error?.message || error;
    }
  },

  updateFaq: async (id: string, faq: Faq) => {
    try {
      // Check for duplicate FAQ before updating, excluding the current FAQ
      const store = get();
      const isDuplicate = await store.checkDuplicateFaq(faq.question, id);
      if (isDuplicate) {
        throw new Error('A FAQ with this question already exists');
      }

      const res = await axiosInstance.put(`${API.updatefaq}${id}`, faq);
      set((state) => ({
        faqs: state.faqs.map(f => f._id === id ? { ...f, ...res.data.data } : f),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.message === 'Network error' ? 'Network error' : error?.response?.data?.message || error?.message || 'Failed to update FAQ' });
      throw error?.response?.data?.message || error?.message || error;
    }
  },

  deleteFaq: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.deletefaq}${id}`);
      set((state) => ({
        faqs: state.faqs.filter(f => f._id !== id),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.message === 'Network error' ? 'Network error' : error?.message || error?.response?.data?.message || 'Failed to delete FAQ' });
    }
  },

  toggleStatusFaq: async (id: string) => {
    try {
      const res = await axiosInstance.patch(`${API.toggleStatusfaq}${id}`);
      set((state) => ({
        faqs: state.faqs.map(f => {
          if (f._id === id) {
            return {
              ...f,
              status: res.data.data.status
            };
          }
          return f;
        }),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.message === 'Network error' ? 'Network error' : error?.message || error?.response?.data?.message || 'Failed to toggle status' });
    }
  }
}));
