import { create } from "zustand";
import axiosInstance from "../components/utils/axios";
import type { Coupon } from "../types/common";
import ImportedURL from "../common/urls";

const { API } = ImportedURL;

interface CouponState {

  coupons: Coupon[];
  trashCoupons: Coupon[];

  loading: boolean;
  error: string | null;

  currentPage: number;
  totalPages: number;

  totalCoupons: number;
  totalActive: number;
  totalInactive: number;

  trashCurrentPage: number;
  trashTotalPages: number;
  totalTrashCoupons: number;


  fetchCoupons: (
    page?: number,
    limit?: number,
    filter?: "total" | "active" | "inactive"
  ) => Promise<void>;

  fetchTrashCoupons: (
    page?: number,
    limit?: number
  ) => Promise<void>;

  addCoupon: (data: any) => Promise<void>;

  updateCoupon: (
    id: string,
    data: any
  ) => Promise<void>;

  softDeleteCoupon: (
    id: string
  ) => Promise<void>;

  restoreCoupon: (
    id: string
  ) => Promise<void>;

  hardDeleteCoupon: (
    id: string
  ) => Promise<void>;

  toggleCouponStatus: (
    id: string
  ) => Promise<void>;

}



export const useCouponStore = create<CouponState>((set, get) => ({

  coupons: [],
  trashCoupons: [],

  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,

  totalCoupons: 0,
  totalActive: 0,
  totalInactive: 0,

  trashCurrentPage: 1,
  trashTotalPages: 1,
  totalTrashCoupons: 0,


  // FETCH COUPONS

  fetchCoupons: async (
    page = 1,
    limit = 10,
    filter = "total"
  ) => {

    try {

      set({ loading: true, error: null });

      const params: any = { page, limit };

      if (filter !== "total")
        params.status = filter;


      const res =
        await axiosInstance.get(
          API.listCoupon,
          { params }
        );


      const { data, meta, counts }
        = res.data;


      set({

        coupons: data,

        currentPage: meta.page,

        totalPages: meta.totalPages,

        totalCoupons: counts.totalCoupons,

        totalActive: counts.totalActive,

        totalInactive: counts.totalInactive,

        loading: false

      });

    }

    catch (error: any) {

      set({

        error:
          error?.response?.data?.message
          ||
          "Failed to fetch coupons",

        loading: false

      });

    }

  },



  // FETCH TRASH

  fetchTrashCoupons:
    async (page = 1, limit = 10) => {

      try {

        set({ loading: true });

        const res =
          await axiosInstance.get(
            API.trashCoupon,
            { params: { page, limit } }
          );


        const { data, meta }
          = res.data;


        set({

          trashCoupons: data,

          trashCurrentPage: meta.page,

          trashTotalPages: meta.totalPages,

          totalTrashCoupons: meta.total,

          loading: false

        });

      }

      catch (error: any) {

        set({

          error:
            error?.response?.data?.message
            ||
            "Failed to fetch trash coupons",

          loading: false

        });

      }

    },



  // ADD

  addCoupon:
    async (data) => {

      try {

        await axiosInstance.post(
          API.addCoupon,
          data
        );

        await get().fetchCoupons(
          get().currentPage
        );

      }

      catch (error: any) {

        set({

          error:
            error?.response?.data?.message
            ||
            "Failed to add coupon"

        });

        throw error;

      }

    },



  // UPDATE

  updateCoupon:
    async (id, data) => {

      try {

        await axiosInstance.put(
          `${API.updateCoupon}${id}`,
          data
        );


        await get().fetchCoupons(
          get().currentPage
        );

      }

      catch (error: any) {

        set({

          error:
            error?.response?.data?.message
            ||
            "Failed to update coupon"

        });

        throw error;

      }

    },



  // SOFT DELETE

  softDeleteCoupon:
    async (id) => {

      try {

        await axiosInstance.delete(
          `${API.softDeleteCoupon}${id}`
        );


        await get().fetchCoupons(
          get().currentPage
        );


        await get().fetchTrashCoupons(
          get().trashCurrentPage
        );

      }

      catch (error: any) {

        set({

          error:
            error?.response?.data?.message
            ||
            "Failed to trash coupon"

        });

      }

    },



  // RESTORE

  restoreCoupon:
    async (id) => {

      try {

        await axiosInstance.patch(
          `${API.restoreCoupon}${id}`
        );


        await get().fetchCoupons(
          get().currentPage
        );


        await get().fetchTrashCoupons(
          get().trashCurrentPage
        );

      }

      catch (error: any) {

        set({

          error:
            error?.response?.data?.message
            ||
            "Failed to restore coupon"

        });

      }

    },



  // HARD DELETE

  hardDeleteCoupon:
    async (id) => {

      try {

        await axiosInstance.delete(
          `${API.hardDeleteCoupon}${id}`
        );


        await get().fetchCoupons(
          get().currentPage
        );


        await get().fetchTrashCoupons(
          get().trashCurrentPage
        );

      }

      catch (error: any) {

        set({

          error:
            error?.response?.data?.message
            ||
            "Failed to delete coupon"

        });

      }

    },



  // TOGGLE STATUS

  toggleCouponStatus:
    async (id) => {

      try {

        await axiosInstance.patch(
          `${API.toggleCouponStatus}${id}`
        );


        await get().fetchCoupons(
          get().currentPage
        );

      }

      catch (error: any) {

        set({

          error:
            error?.response?.data?.message
            ||
            "Failed to update status"

        });

        throw error;

      }

    },

}));
