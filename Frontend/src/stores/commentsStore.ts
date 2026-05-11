import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import ImportedURL from "../common/urls";
import type { Comment } from "../types/common";
const { API } = ImportedURL;


interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;
  totalComments: number;
  totalActive: number;
  totalInactive: number;

  fetchComments: ( page?: number, limit?: number, status?: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  toggleCommentStatus: (id: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalComments: 0,
  totalActive: 0,       
totalInactive: 0,

  //  FETCH COMMENTS
 fetchComments: async (page = 1, limit = 10, status = "all") => {
  try {
    set({ loading: true, error: null });

    const res = await axiosInstance.get(API.listComments, {
      params: { page, limit, status }, 
    });

    const { data, meta } = res.data;

    set({
      comments: data,
      currentPage: meta.page,
      totalPages: meta.totalPages,
      totalComments: meta.total,
      totalActive: meta.totalActive,
      totalInactive: meta.totalInactive,
      loading: false,
    });
  } catch (error: any) {
    set({
      error: error?.response?.data?.message || "Failed to fetch comments",
      loading: false,
    });
  }
},

  //  DELETE COMMENT
  deleteComment: async (id: string) => {
    try {
      await axiosInstance.delete(API.deleteComment(id));

      // Refresh list after delete
      await get().fetchComments(get().currentPage);
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Failed to delete comment",
      });
      throw error;
    }
  },

  // 🔁 TOGGLE COMMENT STATUS
  toggleCommentStatus: async (id: string) => {
    try {
      await axiosInstance.patch(API.toggleCommentStatus(id));

      // Refresh list after toggle
      await get().fetchComments(get().currentPage);

    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Failed to toggle status",
      });
      throw error;
    }
  },
}));