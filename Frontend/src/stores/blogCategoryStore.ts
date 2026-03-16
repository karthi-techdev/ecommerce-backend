import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { BlogCategory } from "../types/common";
import ImportedURL from "../common/urls";
import { useBlogStore } from "./blogStore";   // ✅ IMPORTANT

const { API } = ImportedURL;

interface BlogCategoryState {
  blogCategories: BlogCategory[];
  trashBlogCategories: BlogCategory[];
  loading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;
  totalBlogCategories: number;
  totalActive: number;
  totalInactive: number;

  fetchBlogCategories: (
    page?: number,
    limit?: number,
    filter?: "total" | "active" | "inactive"
  ) => Promise<void>;

  fetchTrashBlogCategories: (page?: number, limit?: number) => Promise<void>;

  addBlogCategory: (data: {
    name: string;
    slug: string;
    isActive: boolean;
  }) => Promise<void>;

  updateBlogCategory: (
    id: string,
    data: { name: string; slug: string; isActive: boolean }
  ) => Promise<void>;

  softDeleteBlogCategory: (id: string) => Promise<void>;
  restoreBlogCategory: (id: string) => Promise<void>;
  deleteBlogCategoryPermanently: (id: string) => Promise<void>;
  toggleBlogCategoryStatus: (id: string) => Promise<void>;
}

export const useBlogCategoryStore = create<BlogCategoryState>((set, get) => ({
  blogCategories: [],
  trashBlogCategories: [],
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalBlogCategories: 0,
  totalActive: 0,
  totalInactive: 0,

  fetchBlogCategories: async (page = 1, limit = 10, filter = "total") => {
    try {
      set({ loading: true });

      const params: any = { page, limit };
      if (filter !== "total") params.status = filter;

      const res = await axiosInstance.get(API.listBlogCategory, { params });

      const { data, meta } = res.data.data;

      set({
        blogCategories: data,
        currentPage: meta.page,
        totalPages: meta.totalPages,
        totalBlogCategories: meta.total,
        totalActive: data.filter((c: BlogCategory) => c.isActive).length,
        totalInactive: data.filter((c: BlogCategory) => !c.isActive).length,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message,
        loading: false,
      });
    }
  },

  fetchTrashBlogCategories: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(API.trashBlogCategory, {
        params: { page, limit },
      });

      const dataArray = res.data?.data?.data || res.data?.data || [];
      const meta = res.data?.data?.meta || { page, totalPages: 1 };

      set({
        trashBlogCategories: dataArray,
        currentPage: meta.page,
        totalPages: meta.totalPages || 1,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to fetch trash data",
        loading: false,
      });
    }
  },

  addBlogCategory: async (data) => {
    await axiosInstance.post(API.addBlogCategory, data);
    await get().fetchBlogCategories();
  },

  updateBlogCategory: async (id, data) => {
    await axiosInstance.put(`${API.updateBlogCategory}${id}`, data);
    await get().fetchBlogCategories();
  },

  softDeleteBlogCategory: async (id) => {
    await axiosInstance.delete(`${API.softDeleteBlogCategory}${id}`);
    await get().fetchBlogCategories();
  },

  restoreBlogCategory: async (id) => {
    await axiosInstance.patch(`${API.restoreBlogCategory}${id}`);
    await get().fetchBlogCategories();
  },

  deleteBlogCategoryPermanently: async (id) => {
    await axiosInstance.delete(`${API.hardDeleteBlogCategory}${id}`);
  },

toggleBlogCategoryStatus: async (id: string) => {
  try {

    const { blogCategories } = get();
    const category = blogCategories.find(c => c._id === id);
    if (!category) return;

    const blogStore = useBlogStore.getState();

    if (!blogStore.blogs || blogStore.blogs.length === 0) {
      await blogStore.fetchBlogs();
    }

    const blogs = useBlogStore.getState().blogs;

    if (category.isActive) {

      const activeBlogExists = blogs.some(
        (blog) =>
          blog.categoryId &&
          blog.categoryId._id === id &&
          blog.isActive === true
      );

      if (activeBlogExists) {
        throw new Error(
          "Cannot deactivate category because active blogs exist in this category."
        );
      }

    }

    await axiosInstance.patch(`${API.toggleBlogCategoryStatus}${id}`);

    await get().fetchBlogCategories();

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update category status"
    );

  }
},

  
}));