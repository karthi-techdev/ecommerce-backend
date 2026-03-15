import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

// Reusing your Offer interface or defining locally
export interface Offer {
  _id: string;
  name: string;
  banner : string;
  description?: string;
  buttonName: string;
  products: any[]; // IDs or Populated Product objects
  productCount?: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface OfferPayload {
  name: string;
  description?: string;
  buttonName: string;
  products: string[]; // Array of Product ObjectIds
  isActive?: boolean;
}

interface OfferStats {
  total: number;
  active: number;
  inactive: number;
}

interface OfferState {
  offers: Offer[];
  stats: OfferStats;
  loading: boolean;
  error: string | null;

  // Pagination/Metadata
  page: number;
  totalPages: number;

  // Actions
  fetchOffers: (page?: number, limit?: number, status?: string) => Promise<void>;
  fetchOfferById: (id: string) => Promise<Offer | null>;
  addOffer: (offer: OfferPayload) => Promise<void>;
  updateOffer: (id: string, offer: OfferPayload) => Promise<void>;
  toggleOfferStatus: (id: string) => Promise<void>;
  
  // Trash/Delete Actions
//   softDeleteOffer: (id: string) => Promise<void>;
//   restoreOffer: (id: string) => Promise<void>;
  permanentDeleteOffer: (id: string) => Promise<void>;
  
  // Validation
  checkDuplicateOffer: (name: string, excludeId?: string) => Promise<boolean>;
}

export const useOfferStore = create<OfferState>((set) => ({
  offers: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

//   fetchOffers: async (page?: number, limit?: number, status?: string) => {
//   try {
//     set({ loading: true, error: null });

//     const res = await axiosInstance.get(API.listOffer);

//     console.log("response", res.data);

//     const data = res?.data?.data?.data || [];
//     const meta = res?.data?.data?.meta || {};

//     set({
//       offers: Array.isArray(data) ? data : [],
//       stats: {
//         total: meta?.total || 0,
//         active: meta?.active || 0,
//         inactive: meta?.inactive || 0,
//       },
//       loading: false,
//     });

//   } catch (error: any) {
//     set({
//       error: error?.response?.data?.message || "Failed to fetch offers",
//       loading: false,
//     });
//   }
// },

fetchOffers: async (page = 1, limit = 10, status?: string) => {
  try {
    set({ loading: true, error: null });

    const res = await axiosInstance.get(API.listOffer, {
      params: {
        page,
        limit,
        status
      }
    });

    const data = res?.data?.data?.data || [];
    const meta = res?.data?.data?.meta || {};

    set({
      offers: Array.isArray(data) ? data : [],
      stats: {
        total: meta?.total || 0,
        active: meta?.active || 0,
        inactive: meta?.inactive || 0,
      },
      page: meta?.page || 1,
      totalPages: meta?.totalPages || 1,
      loading: false,
    });

  } catch (error: any) {
    set({
      error: error?.response?.data?.message || "Failed to fetch offers",
      loading: false,
    });
  }
},

  fetchOfferById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getOfferById}${id}`);
      const offer = res.data.data;

      set((state) => ({
        offers: state.offers.some((o) => o._id === id)
          ? state.offers.map((o) => (o._id === id ? offer : o))
          : [...state.offers, offer],
        loading: false,
      }));

      return offer;
    } catch (error: any) {
      set({ loading: false, error: 'Failed to fetch offer details' });
      return null;
    }
  },

  addOffer: async (offer) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post(API.addOffer, offer);
      
      set((state) => ({
        offers: [res.data.data, ...state.offers],
        loading: false
      }));
    } catch (error: any) {
      set({ loading: false });
      throw error; // Let the component handle the toast error
    }
  },

  updateOffer: async (id, offer) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put(`${API.updateOffer}${id}`, offer);
      
      set((state) => ({
        offers: state.offers.map((o) => (o._id === id ? { ...o, ...res.data.data } : o)),
        loading: false
      }));
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

permanentDeleteOffer: async (id: string) => {
    try {
        const repo = await axiosInstance.delete(`${API.permanentDeleteOffer}${id}`);
        console.log("repo", repo);
        set((state) => ({
            offers: state.offers.filter((o) => o._id !== id),
            error: null
        }));
    } catch (error: any) {
        set({ error: error?.response?.data?.message || 'Permanent deletion failed' });
        throw error;
    }
},

// 2. Toggle Status
toggleOfferStatus: async (id: string) => {
    try {
        // Using PATCH as defined in your route
        const response = await axiosInstance.patch(`${API.toggleOfferStatus}${id}`);
        set((state) => ({
            offers: state.offers.map((o) => 
                o._id === id ? { ...o, isActive: !o.isActive } : o
            ),
            error: null
        }));
        return response.data;
    } catch (error: any) {
        set({ error: error?.response?.data?.message || 'Failed to toggle status' });
        throw error;
    }
},

  checkDuplicateOffer: async (name, excludeId) => {
    try {
      const res = await axiosInstance.post(API.checkOfferDuplicate, { name, excludeId });
      return res.data.exists;
    } catch (error) {
      return false;
    }
  },
}));


//   softDeleteOffer: async (id) => {
//     try {
//       await axiosInstance.delete(`${API.softDeleteOffer}${id}`);
//       set((state) => ({
//         offers: state.offers.filter((o) => o._id !== id),
//       }));
//       get().fetchOffers();
//     } catch (error: any) {
//       set({ error: 'Failed to move offer to trash' });
//     }
//   },

//   restoreOffer: async (id) => {
//     try {
//       await axiosInstance.put(`${API.restoreOffer}${id}`);
//       get().fetchOffers(); // Refresh list to see restored item
//     } catch (error: any) {
//       throw error;
//     }
//   },

// fetchOffers: async (page?: number, limit?: number, status?: string) => {
  //   try {
  //     set({ loading: true, error: null });
  //     const res = await axiosInstance.get(API.listOffer);
  //     console.log("res",res)
  //     const { data, meta } = res.data.data;

  //     set({
  //       offers: Array.isArray(data) ? data : [],
  //       stats: {
  //         total: meta?.total || 0,
  //         active: meta?.active || 0,
  //         inactive: meta?.inactive || 0,
  //       },
  //       loading: false,
  //     });
  //   } catch (error: any) {
  //     set({
  //       error: error?.response?.data?.message || 'Failed to fetch offers',
  //       loading: false,
  //     });
  //   }
  // }, 