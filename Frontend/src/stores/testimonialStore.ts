import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { Testimonial } from "../types/common";
import ImportedURL from "../common/urls";

const { API } = ImportedURL;

interface TestimonialState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;
  totalTestimonial: number;
  totalActive: number;
  totalInactive: number;

  fetchTestimonial: (
    page?: number,
    limit?: number,
    filter?: "total" | "active" | "inactive"
  ) => Promise<void>;

  addTestimonial: (formData: FormData) => Promise<void>;
  updateTestimonial: (id: string, formData: FormData) => Promise<void>;
  softDeleteTestimonial: (id: string) => Promise<void>;
  hardDeleteTestimonial: (id: string) => Promise<void>;
  toggleTestimonialStatus: (id: string) => Promise<void>;
  checkTestimonialNameExists: (name: string, excludeId?: string) => boolean;
}

export const useTestimonialStore = create<TestimonialState>((set, get) => ({

  testimonials: [],
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalTestimonial: 0,
  totalActive: 0,
  totalInactive: 0,

  fetchTestimonial: async (
    page = 1,
    limit = 10,
    filter: "total" | "active" | "inactive" = "total"

  ) => {
    try {
      set({ loading: true, error: null });

      const params: any = { page, limit };

      if (filter !== "total") params.filter = filter;


      const res = await axiosInstance.get(API.listTestimonial, { params });

      const { data, meta, counts } = res.data;

      set({
        testimonials: data,
        currentPage: meta.page,
        totalPages: meta.totalPages,
        totalTestimonial: counts.totalTestimonial,
        totalActive: counts.totalActive,
        totalInactive: counts.totalInactive,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch Testimonial",
        loading: false,
      });
    }
  },

  addTestimonial: async (formData: FormData) => {
    try {
      await axiosInstance.post(API.addTestimonial, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchTestimonial(get().currentPage);
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to add Testimonial",
      });
      throw error;
    }
  },

  updateTestimonial: async (id: string, formData: FormData) => {
    try {
      await axiosInstance.put(`${API.updateTestimonial}${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchTestimonial(get().currentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Failed to update Testimonial",
      });
      throw error;
    }
  },

  softDeleteTestimonial: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.deleteTestimonial}${id}`);

      await get().fetchTestimonial(get().currentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to delete Testimonial",
      });
    }
  },

  hardDeleteTestimonial: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.hardDeleteTestimonial}/${id}`);

      await get().fetchTestimonial(get().currentPage);

    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to permanently delete Testimonial",
      });
    }
  },

  toggleTestimonialStatus: async (id: string) => {
    try {
      await axiosInstance.patch(`${API.toggleStatusTestimonial}/${id}`, {});
      await get().fetchTestimonial(get().currentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Failed to update status",
      });
      throw error;
    }
  },

  checkTestimonialNameExists: (name: string, excludeId?: string) => {
    const testimonials = get().testimonials;

    return testimonials.some(
      (testimonial) =>
        testimonial.name.toLowerCase() === name.toLowerCase() &&
        testimonial._id !== excludeId
    );
  },

}));