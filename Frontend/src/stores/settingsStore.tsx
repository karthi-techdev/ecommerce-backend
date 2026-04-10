import { create } from "zustand";
import axiosInstance from '../components/utils/axios';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

export interface ISettings {
  generalSettings: {
    siteName: string;
    siteDescription: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    currency: string;
  };
  branding: {
    adminLogo: string;
    siteLogo: string;
    favicon: string;
  };
  mailConfiguration: {
    mailHost: string;
    mailPort: number;
    mailUsername: string;
    mailPassword: string;
    mailEncryption: string;
    mailFromAddress: string;
    mailFromName: string;
  };
}

export interface SecuritySettingsFormData {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface SettingsState {
  settings: ISettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<ISettings | null>;
  
  updateSettings: (payload: FormData | Partial<ISettings> | SecuritySettingsFormData) => Promise<ISettings | null>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(API.getSettings);
      const data = res.data?.data;
      set({ settings: data, loading: false });
      return data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to fetch settings";
      set({ loading: false, error: msg });
      return null;
    }
  },

  updateSettings: async (payload: FormData | Partial<ISettings> | SecuritySettingsFormData) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.put(API.updateSettings, payload);
      
      const updatedData = res.data?.data;

      set((state) => ({
        settings: updatedData || state.settings, 
        loading: false 
      }));

      return updatedData;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to update settings";
      set({ loading: false, error: errorMessage });
      throw error; 
    }
  },
}));