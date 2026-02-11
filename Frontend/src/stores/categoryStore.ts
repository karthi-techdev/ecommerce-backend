import { create } from 'zustand';
import axiosInstance from '../utils/axios';
import type { Category,mainCategory, subCategory } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
}
export interface CategoryPayload {
  name: string;
  description: string;
  slug:string;
  mainCategoryId: string;   
  subCategoryId: string;    
  image: File |string| null;
  status?:string;
}

interface CategoryState {
  categories: Category[];
  mainCategories:mainCategory[];
  subCategories:subCategory[];
  stats: CategoryStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchCategories: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  fetchCategoryById: (id: string) => Promise<Category | null>;
  addCategory: (category: CategoryPayload) => Promise<void>;
  updateCategory: (id: string, category: CategoryPayload) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategory:(id:string)=>Promise<void>;
  trashCategory:(page?:number,limit?:number,filter?:'total'|'active'|'inactive')=>Promise<void>;
  restoreCategory:(id:string)=>Promise<void>;
  permanentDeleteCategory:(id:string)=>Promise<void>;
  categorystats:()=>Promise<void>;
  fetchMainCategory:()=>Promise<void>;
  fetchSubCategory:(mainCategoryId:string)=>Promise<void>;
  slugEXist:(data:any)=>Promise<Boolean>;
}



export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  mainCategories:[],
  subCategories:[],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchCategories: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
          filter === 'inactive' ? 'inactive' : '';
      const res = await axiosInstance.get(`${API.listCategory}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      const { data: categoryData, meta } = res.data.data;
      set({
        categories: Array.isArray(categoryData) ? categoryData : [],
        page,
        totalPages: meta?.totalPages ?? 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error?.message === 'Network error' ? 'Network error' : error?.message || error?.response?.data?.message || 'Failed to fetch Categories',
        categories: [],
        stats: { total: 0, active: 0, inactive: 0 },
        loading: false
      });
    }
  },
  fetchMainCategory:async()=>{
    try {
      const res=await axiosInstance.get(`${API.mainCategory}`);
      const mainCategoriesData=res.data.data;
      set({
        mainCategories:Array.isArray(mainCategoriesData)?mainCategoriesData:[],
        error:null,
        loading:false
      })
    } catch (error:any) {
      set({
        error:error.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to load main category',
        loading:false,
        mainCategories:[],
      })
    }
  },
  fetchSubCategory:async(mainCategoryId:string)=>{
    try {
      const res=await axiosInstance.get(`${API.subCategory}${mainCategoryId}`);
      const subCategoriesData=res.data.data;
      set({
        subCategories:Array.isArray(subCategoriesData)?subCategoriesData:[],
        error:null,
        loading:false
      })
    } catch (error:any) {
      set({
        error:error.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to load sub category',
        loading:false,
        subCategories:[],
      })
    }
  },
  trashCategory:async(page=1,limit=5,filter='total')=>{
    try {
      set({loading:true,error:null});
      const statusParam=filter==='active'?'active':filter==='inactive'?'inactive':'';
      const res=await axiosInstance.get(`${API.trashCategory}?page=${page}?limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      const {data:categories,meta}=res.data.data;
      set({
        categories:Array.isArray(categories)?categories:[],
        stats:{
          total:meta?.total??0,
          active:meta?.active??0,
          inactive:meta?.inactive??0
        },
        error:null,
        loading:false,
        totalPages:meta?.totalPages??1
      })
    } catch (error:any) {
      set({
        error:error.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to load category trash',
        loading:false,
        categories:[],
      })
    }
  }
,
categorystats:async()=>{
  try {
    const res=await axiosInstance.get(`${API.categoryStats}`);
    set({
      stats:{
        total:res.data.data.total,
        active:res.data.data.active,
        inactive:res.data.data.inactive
      }
    })
  } catch (error:any) {
      set({        error:error.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to load category stats',
})
  }
},
permanentDeleteCategory:async(id:string)=>{
    try {
      const res=await axiosInstance.delete(`${API.permanentDeleteCategory}${id}`);
       set((state) => ({
        categories: state.categories.filter(c => c._id !== id),
        error: null
      }));
    } catch (error:any) {
      set({
        error:error?.message==='Network Error'?'Network Error':error?.message||error.response.data.message||'Failed to delete category permanently'
      })
    }
  }
,
restoreCategory:async(id:string)=>{
    try {
      const res=await axiosInstance.patch(`${API.restoreCategory}${id}`);
      const restoredData=res.data.data;
      set((state)=>({
        categories:[...state.categories.filter((c)=>c._id!==id),restoredData],
        error:null
      }))
    } catch (error:any) {
      set({error:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to restore category'})
    }
  }
,
slugEXist: async (data: any) => {
  try {
    const res = await axiosInstance.post(API.slugExist, data);
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
}
,
  fetchCategoryById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`${API.getCategory}${id}`);
      const category = res.data.data;
      set((state) => ({
        categories: state.categories.some(f => f._id === id)
          ? state.categories.map(f => f._id === id ? category : f)
          : [...state.categories, category],
        loading: false,
      }));
      return category;
    } catch (error: any) {
      set({ error: error?.message || error?.response?.data?.message || 'Failed to fetch Category', loading: false });
      return null;
    }
  },

  addCategory: async (category: CategoryPayload) => {
    try {
      console.log(category)
      const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('slug', category.slug);
    formData.append('mainCategoryId', category.mainCategoryId);
    formData.append('subCategoryId', category.subCategoryId);
    if (category.image instanceof File) {
      formData.append('image', category.image);
    }
    console.log(formData);
for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

      const res = await axiosInstance.post(API.addCategory, formData);
      set((state) => ({
        categories: [...state.categories, res.data.data],
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.message === 'Network error' ? 'Network error' : error?.response?.data?.message || error?.message || 'Failed to add Categories' });
      throw error?.response?.data?.message || error?.message || error;
    }
  },

 updateCategory: async (id: string, category: CategoryPayload) => {
  try {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('slug', category.slug);
    formData.append('mainCategoryId', category.mainCategoryId);
    formData.append('subCategoryId', category.subCategoryId);
    if (category.image instanceof File) {
      formData.append('image', category.image);
    }
    console.log('store room',category)
    if (category.status) {
      formData.append('status', category.status);
    }
    const res = await axiosInstance.put(
      `${API.updateCategory}${id}`,
      formData
    );
    set((state) => ({
      categories: state.categories.map((c) =>
        c._id === id ? { ...c, ...res.data.data } : c
      ),
      error: null,
    }));
  } catch (error: any) {
    set({
      error:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update category',
    });
    throw error;
  }
},


  deleteCategory: async (id: string) => {
    try {
      await axiosInstance.patch(`${API.deleteCategory}${id}`);
      set((state) => ({
        categories: state.categories.filter(f => f._id !== id),
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.message === 'Network error' ? 'Network error' : error?.message || error?.response?.data?.message || 'Failed to delete Category' });
    }
  },
  toggleCategory:async(id:string)=>{
    try {
     const res= await axiosInstance.patch(`${API.toggleStatusCategory}${id}`);
      set((state) => ({
        categories: state.categories.map(c => {
          if (c._id === id) {
            return {
              ...c,
              status: res.data.data.status
            };
          }
          return c;
        }),
        error: null
      }));
    } catch (error:any) {
      set({error:error?.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to toggle category status'})
    }
  }
}));
