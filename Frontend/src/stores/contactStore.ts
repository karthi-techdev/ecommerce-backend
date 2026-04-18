import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import type { Contact } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface ContactState {
  contacts: Contact[];
  trashContacts: Contact[]; // NEW: For deleted items
  loading: boolean;
  error: string | null;
  
  // Pagination & Meta for Main List
  page: number;
  totalPages: number;
  stats: { total: number; active: number; inactive: number };

  // Pagination & Meta for Trash List
  trashPage: number;
  trashTotalPages: number;
  trashTotal: number;

  // Actions
  fetchContacts: (page?: number, limit?: number) => Promise<void>;
  fetchTrashContacts: (page?: number, limit?: number) => Promise<void>; 
  fetchContactById: (id: string) => Promise<Contact | null>;
  addContact: (data: Contact) => Promise<void>;
  updateContact: (id: string, data: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>; 
  restoreContact: (id: string) => Promise<void>; 
  permanentDeleteContact: (id: string) => Promise<void>; 
  toggleStatusContact: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  trashContacts: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  
  page: 1,
  totalPages: 1,

  trashPage: 1,
  trashTotalPages: 1,
  trashTotal: 0,

  fetchContacts: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(
        `${API.listContacts}?page=${page}&limit=${limit}`
      );
      const { data: contactData, meta } = res.data.data;

      set({
        contacts: contactData,
        stats: {
          total: meta.total,
          active: meta.active,
          inactive: meta.inactive
        },
        totalPages: meta.totalPages,
        page,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch contacts',
        contacts: [],
        loading: false
      });
    }
  },

  fetchTrashContacts: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(
        `${API.listContactTrash}?page=${page}&limit=${limit}`
      );
      const { data: trashData, meta } = res.data.data;

      set({
        trashContacts: trashData,
        trashTotalPages: meta.totalPages,
        trashTotal: meta.total,
        trashPage: page,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch trash',
        trashContacts: [],
        loading: false
      });
    }
  },

  fetchContactById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getContact}${id}`);
      const contact = res.data.data;

      set((state) => ({
        contacts: state.contacts.some(c => c._id === id)
          ? state.contacts.map(c => (c._id === id ? contact : c))
          : [...state.contacts, contact],
        loading: false
      }));
      return contact;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to fetch contact', loading: false });
      return null;
    }
  },

  addContact: async (data: Contact) => {
    try {
      const res = await axiosInstance.post(API.addContact, data);
      set((state) => ({
        contacts: [res.data.data, ...state.contacts],
        error: null
      }));
    } catch (error: any) {
      throw error?.response?.data?.message || 'Failed to add contact';
    }
  },

  updateContact: async (id: string, data: Contact) => {
    try {
      const res = await axiosInstance.put(`${API.updateContact}${id}`, data);
      set((state) => ({
        contacts: state.contacts.map(c =>
          c._id === id ? { ...c, ...res.data.data } : c
        ),
        error: null
      }));
    } catch (error: any) {
      throw error?.response?.data?.message || 'Failed to update contact';
    }
  },

  // SOFT DELETE
  deleteContact: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.softDeleteContact}${id}`);
      set((state) => ({
        contacts: state.contacts.filter(c => c._id !== id),
        // Optionally update stats locally
        stats: { ...state.stats, total: state.stats.total - 1 },
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to delete contact' });
    }
  },

  // RESTORE FROM TRASH
  restoreContact: async (id: string) => {
    try {
      const res = await axiosInstance.patch(`${API.restoreContact}${id}`);
      const restoredItem = res.data.data;

      set((state) => ({
        trashContacts: state.trashContacts.filter(c => c._id !== id),
        contacts: [restoredItem, ...state.contacts], // Add back to main list
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to restore contact' });
    }
  },

  // PERMANENT DELETE
  permanentDeleteContact: async (id: string) => {
    try {
      await axiosInstance.delete(`${API.hardDeleteContact}${id}`);
      set((state) => ({
        trashContacts: state.trashContacts.filter(c => c._id !== id),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to delete permanently' });
    }
  },

  toggleStatusContact: async (id: string) => {
    try {
      const res = await axiosInstance.patch(`${API.toggleStatusContact}${id}`);
      set((state) => ({
        contacts: state.contacts.map(c => {
          if (c._id === id) {
            return { ...c, status: res.data.data.status };
          }
          return c;
        }),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to toggle status' });
    }
  }
}));