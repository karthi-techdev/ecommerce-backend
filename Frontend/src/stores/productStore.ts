import { create } from 'zustand';
import axiosInstance from '../components/utils/axios';
import type { Product } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  slug: string;
  brandId: string;
  mainCategoryId: string;
  subCategoryId: string;
  categoryId: string;
  price: number;
  image: File | string | null;
  status?: string;
}

interface ProductState {
  products: Product[];
  stats: ProductStats;
  loading: boolean;
  error: string | null;

  page: number;
  totalPages: number;

  trashCurrentPage: number;
  trashTotalPages: number;
  totalTrashProducts: number;

  fetchProducts: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;

  fetchProductById: (id: string) => Promise<Product | null>;

  addProduct: (product: ProductPayload) => Promise<void>;
  updateProduct: (id: string, product: ProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProduct: (id: string) => Promise<void>;

  trashProduct: (page?: number, limit?: number) => Promise<void>;

  restoreProduct: (id: string) => Promise<void>;
  permanentDeleteProduct: (id: string) => Promise<void>;

  slugExist: (data: any) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,

  page: 1,
  totalPages: 1,

  trashCurrentPage: 1,
  trashTotalPages: 1,
  totalTrashProducts: 0,


  fetchProducts: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });

      const statusParam =
        filter === 'active'
          ? 'active'
          : filter === 'inactive'
          ? 'inactive'
          : '';

      const res = await axiosInstance.get(
        `${API.listProduct}?page=${page}&limit=${limit}${
          statusParam ? `&status=${statusParam}` : ''
        }`
      );

      const { data, meta } = res.data.data;

      set({
        products: Array.isArray(data) ? data : [],
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch products',
        loading: false,
      });
    }
  },


  fetchProductById: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(
        `${API.getProductById}${id}`
      );

      const product = res.data.data;

      set((state) => ({
        products: state.products.some((p) => p._id === id)
          ? state.products.map((p) =>
              p._id === id ? product : p
            )
          : [...state.products, product],
        loading: false,
      }));

      return product;
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to fetch product',
        loading: false,
      });
      return null;
    }
  },

 
  addProduct: async (product) => {
    try {
      const formData = new FormData();

      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('slug', product.slug);
      formData.append('brandId', product.brandId);
      formData.append('mainCategoryId', product.mainCategoryId);
      formData.append('subCategoryId', product.subCategoryId);
      formData.append('categoryId', product.categoryId);
      formData.append('price', String(product.price));

      if (product.image instanceof File) {
        formData.append('image', product.image);
      }

      const res = await axiosInstance.post(
        API.addProduct,
        formData
      );

      set((state) => ({
        products: [...state.products, res.data.data],
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to add product',
      });
      throw error;
    }
  },


  updateProduct: async (id, product) => {
    try {
      const formData = new FormData();

      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('slug', product.slug);
      formData.append('brandId', product.brandId);
      formData.append('mainCategoryId', product.mainCategoryId);
      formData.append('subCategoryId', product.subCategoryId);
      formData.append('categoryId', product.categoryId);
      formData.append('price', String(product.price));

      if (product.image instanceof File) {
        formData.append('image', product.image);
      }

      if (product.status) {
        formData.append('status', product.status);
      }

      const res = await axiosInstance.put(
        `${API.updateProduct}${id}`,
        formData
      );

      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? { ...p, ...res.data.data } : p
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to update product',
      });
      throw error;
    }
  },

  
  deleteProduct: async (id) => {
    try {
      await axiosInstance.patch(
        `${API.softDeleteProduct}${id}`
      );

      set((state) => ({
        products: state.products.filter(
          (p) => p._id !== id
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to delete product',
      });
    }
  },

  
  toggleProduct: async (id) => {
    try {
      const res = await axiosInstance.patch(
        `${API.toggleProductStatus}${id}`
      );

      set((state) => ({
        products: state.products.map((p) =>
          p._id === id
            ? { ...p, status: res.data.data.status }
            : p
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to toggle product',
      });
    }
  },


  trashProduct: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get(
        `${API.trashProducts}?page=${page}&limit=${limit}`
      );

      const { data, meta } = res.data;

      set({
        products: Array.isArray(data) ? data : [],
        trashCurrentPage: meta.page,
        trashTotalPages: meta.totalPages,
        totalTrashProducts: meta.total,
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to load trash',
        loading: false,
      });
    }
  },

  
  restoreProduct: async (id) => {
    try {
      await axiosInstance.patch(
        `${API.restoreProduct}${id}`
      );

      set((state) => ({
        products: state.products.filter(
          (p) => p._id !== id
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to restore',
      });
    }
  },


  permanentDeleteProduct: async (id) => {
    try {
      await axiosInstance.delete(
        `${API.permanentDeleteProduct}${id}`
      );

      set((state) => ({
        products: state.products.filter(
          (p) => p._id !== id
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          'Failed to permanently delete',
      });
    }
  },


  slugExist: async (data) => {
    try {
      await axiosInstance.post(
        API.checkProductSlug,
        data
      );
      return false;
    } catch (error: any) {
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.code === 'SLUG_EXISTS'
      ) {
        return true;
      }
      return false;
    }
  },
}));
