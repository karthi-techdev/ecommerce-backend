import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { Page } from "../types/common";
import ImportedURL from "../common/urls";

const { API } = ImportedURL;

interface PageStats {
  total: number;
  active: number;
  inactive: number;
}

interface PageState {
  pages: Page[];
  stats: PageStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchPages: (page?: number, limit?: number, filter?: "total" | "active" | "inactive") => Promise<void>;
  fetchPageById: (id: string) => Promise<Page | null>;
  addPages: (formData: any) => Promise<Page | null>; // Changed from FormData to any/object
  updatePages: (id: string, formData: any) => Promise<Page | null>;
  toggleStatusPages: (id: string) => Promise<void>;
  deletePages: (id: string) => Promise<void>;
  hardDeletePages: (id: string) => Promise<void>;
  checkDuplicatePage: (slug: string, excludeId?: string) => Promise<boolean>;
}

export const usePageStore = create<PageState>((set) => ({
  pages: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchPages: async (page = 1, limit = 10, filter = "total") => {
    try {
      set({ loading: true });
      const statusParam = filter === "active" ? "active" : filter === "inactive" ? "inactive" : "";
      const res = await axiosInstance.get(`${API.listPage}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ""}`);
      // const responseData = res.data?.data || {};
      const pages = res.data?.data || [];
      const meta = res.data?.meta || {};
      set({
        pages: pages,
        stats: {
          total: meta.total ?? 0,
          active: meta.active ?? 0,
          inactive: meta.inactive ?? 0,
        },
        totalPages: meta.totalPages ?? 1,
        loading: false,
        error: null
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPageById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getPageById}${id}`);
      set({ loading: false });
      return res.data?.data || null;
    } catch (error: any) {
      set({ loading: false, error: error?.response?.data?.message || "Failed" });
      return null;
    }
  },

  toggleStatusPages: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.patch(`${API.toggleStatusPage}${id}`);
      const updatedPage = res.data?.data;

      set((state) => ({
        loading: false,
        Pages: state.pages.map((p) => (p._id === id ? updatedPage : p)),
      }));
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error?.response?.data?.message || "Failed to toggle status" 
      });
      throw error;
    }
  },

  addPages: async (formData: any) => {
    try {
      const res = await axiosInstance.post(API.addPage, formData);
      const newPage = res.data?.data;
      console.log("added",newPage)
      set((state) => ({ Pages: [...state.pages, newPage], error: null }));
      return newPage;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Failed to add Page" });
      throw error;
    }
  },

  updatePages: async (id: string, formData: any) => {
    try {
      const res = await axiosInstance.put(`${API.updatePage}${id}`, formData);
      const updatedPage = res.data?.data;
      console.log("update",updatedPage)
      set((state) => ({
        pages: state.pages.map((p) => (p._id === id ? updatedPage : p)),
        error: null,
      }));
      return updatedPage;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Failed to update Page" });
      throw error;
    }
  },

  deletePages: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.deletePage}${id}`);
      set((state) => ({ pages: state.pages.filter((p) => p._id !== id) }));
    } catch (error: any) {
      throw error;
    }
  },

  hardDeletePages: async (id: string) => {
    try {

      const deleted = await axiosInstance.delete(`${API.hardDeletePage}${id}`);
      console.log("delete",deleted)
      set((state) => ({ pages: state.pages.filter((p) => String(p._id) !== String(id)) }));
    } catch (error: any) {
      console.log("error")
      throw error;
    }
  },

  checkDuplicatePage: async (slug: string, excludeId?: string) => {
    try {
      const res = await axiosInstance.put(API.checkDuplicatePage, { slug, excludeId: excludeId || null });
      return res.data?.data ?? false;
    } catch (error: any) {
      throw error;
    }
  },
}));