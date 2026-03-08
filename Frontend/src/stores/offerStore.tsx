import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

// Reusing your Offer interface or defining locally
export interface Offer {
  _id: string;
  name: string;
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
  fetchOffers: () => Promise<void>;
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

export const useOfferStore = create<OfferState>((set, get) => ({
  offers: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchOffers: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(API.listOffer);
      
      const { data, meta } = res.data.data;

      set({
        offers: Array.isArray(data) ? data : [],
        stats: {
          total: meta?.total || 0,
          active: meta?.active || 0,
          inactive: meta?.inactive || 0,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch offers',
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

  toggleOfferStatus: async (id) => {
    try {
      const res = await axiosInstance.patch(`${API.toggleOfferStatus}${id}`);
      const updatedOffer = res.data.data;

      set((state) => ({
        offers: state.offers.map((o) =>
          o._id === id ? { ...o, isActive: updatedOffer.isActive } : o
        ),
      }));
      
      // Refresh stats after toggle
      get().fetchOffers(); 
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Toggle failed' });
    }
  },

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

  permanentDeleteOffer: async (id) => {
    try {
      await axiosInstance.delete(`${API.permanentDeleteOffer}${id}`);
      set((state) => ({
        offers: state.offers.filter((o) => o._id !== id),
      }));
    } catch (error: any) {
      set({ error: 'Permanent deletion failed' });
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