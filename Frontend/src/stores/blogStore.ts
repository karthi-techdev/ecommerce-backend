import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';

export interface BlogFormData {
  name: string;
  slug: string;
  categoryId: string;
  isActive: boolean;
  coverImage?: File | string;
  description?: string;
}

interface Blog {
  _id: string;
  name: string;
  slug: string;
  categoryId: { _id: string; name: string } | string;
  isActive: boolean;
  image?: string;
  description?: string;
}

interface BlogStore {
  blogs: Blog[];
  trashedBlogs: Blog[];
  loading: boolean;
  fetchBlogs: () => Promise<void>;
  fetchTrashBlogs: (page?: number, limit?: number) => Promise<void>;
  fetchBlogById: (id: string) => Promise<Blog | null>;
  addBlog: (data: FormData) => Promise<void>;
  updateBlog: (id: string, data: FormData) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  toggleBlogStatus: (id: string) => Promise<void>;
  restoreBlog: (id: string) => Promise<void>;
  permanentDeleteBlog: (id: string) => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  trashedBlogs: [],
  loading: false,

  fetchBlogs: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(ImportedURL.API.listBlog);
      set({ blogs: res.data.data.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchTrashBlogs: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${ImportedURL.API.trashBlog}?page=${page}&limit=${limit}`);
      set({ trashedBlogs: res.data.data.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchBlogById: async (id: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(ImportedURL.API.getBlog(id));
      return res.data.data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  addBlog: async (data: FormData) => {
    set({ loading: true });
    try {
      await axios.post(ImportedURL.API.addBlog, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await get().fetchBlogs();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateBlog: async (id: string, data: FormData) => {
    set({ loading: true });
    try {
      await axios.put(ImportedURL.API.updateBlog(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await get().fetchBlogs();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteBlog: async (id: string) => {
    set({ loading: true });
    try {
      await axios.delete(ImportedURL.API.softDeleteBlog(id));
      await get().fetchBlogs();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  toggleBlogStatus: async (id: string) => {
    set({ loading: true });
    try {
      await axios.patch(ImportedURL.API.toggleBlogStatus(id));
      await get().fetchBlogs();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  restoreBlog: async (id: string) => {
    set({ loading: true });
    try {
      await axios.patch(ImportedURL.API.restoreBlog(id));
      await get().fetchTrashBlogs();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  permanentDeleteBlog: async (id: string) => {
    set({ loading: true });
    try {
      await axios.delete(ImportedURL.API.permanentDelete(id));
      await get().fetchTrashBlogs();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));