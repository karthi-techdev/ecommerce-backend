import {create} from 'zustand';
import type { Config } from '../types/common';
import axiosInstance from '../components/utils/axios';
import ImportedURL from '../common/urls';
import { da } from 'zod/v4/locales';

const {API}=ImportedURL;

interface ConfigStats {
  total: number;
  active: number;
  inactive: number;
}

interface ConfigState{
    configs:Config[];
    stats:ConfigStats;
    loading:boolean;
    error:string|null;
    page:number;
    totalPages:number;
    addConfig:(data:Partial<Config>)=>Promise<void>;
    getAllConfigs:(page?:number,limit?:number,filter?:'active'|'inactive'|'total')=>Promise<void>;
    getConfigById:(id:string)=>Promise<Config|null>;
    updateConfig:(id:string,data:Partial<Config>)=>Promise<void>;
    deleteConfig:(id:string)=>Promise<void>;
    configstats:()=>Promise<void>;
    toggleConfigStatus:(id:string)=>Promise<void>;
}

export const useConfigStore=create<ConfigState>((set,get)=>({
    configs:[],
    stats:{total:0,active:0,inactive:0},
    error:null,
    loading:false,
    page:1,
    totalPages:1,
    addConfig:async(data:Partial<Config>)=>{
        try {
            const res=await axiosInstance.post(`${API.addConfig}`,data);
            console.log(res,'add here');
            set((state) => ({
        configs: [...state.configs, res.data.data],
        error: null
      }));
    } catch (error: any) {
      set({ error: error?.message === 'Network error' ? 'Network error' : error?.response?.data?.message || error?.message || 'Failed to add Configs' });
      throw error?.response?.data?.message || error?.message || error;
    }
    },
   getAllConfigs: async (page = 1, limit = 10, filter = 'total') => {
  try {
    set({ loading: true, error: null });

    const params =
      filter === 'active'
        ? 'active'
        : filter === 'inactive'
        ? 'inactive'
        : '';

    const res = await axiosInstance.get(
      `${API.listConfig}?page=${page}&limit=${limit}${
        params ? `&status=${params}` : ''
      }`
    );

    const response = res.data.data;

    set({
      configs: response.data || [],
      totalPages: response.totalPages || 1,  // ✅ ADD THIS
      loading: false,
      error: null,
      page
    });
  } catch (error: any) {
    set({
      error:
        error?.message === 'Network error'
          ? 'Network Error'
          : error?.message ||
            error?.response?.data?.message ||
            'Failed to fetch config data',
      configs: [],
      loading: false,
    });
  }
},

    getConfigById:async(id:string)=>{
        try {
            set({loading:true,error:null});
            const res=await axiosInstance.get(`${API.getConfigById}${id}`);
           
                const config = res.data?.data; 

    if (!config) {
      set({ loading: false });
      return null;
    }

    set((state) => ({
      configs: state.configs.some(c => c?._id === id)
        ? state.configs.map(c => c?._id === id ? config : c)
        : [...state.configs, config],
      loading: false
    }));

    return config;

        } catch (error:any) {
            set({
                error:error?.message==='Network error'?'Network Error':error?.message||error?.response?.data?.message||'Failed to fetch config data',
                loading:false,
            })
        }
    },
    configstats:async()=>{
  try {
    const res=await axiosInstance.get(`${API.configStats}`);
    
    set({
      stats:{
        total:res.data.data.total,
        active:res.data.data.active,
        inactive:res.data.data.inactive
      }
    })
  } catch (error:any) {
      set({        error:error.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to load config stats',
})
  }
},
    updateConfig:async(id:string,data:Partial<Config>)=>{
        try {
             console.log(data,'data here for update')
            const res=await axiosInstance.put(`${API.updateConfig}${id}`,data);
        
            set((state)=>({
                configs:state.configs.map(c=>c._id===id?{...c,...res.data.data}:c),
                loading:false
            }))
        } catch (error:any) {
            set({
                error:error?.message==='Network error'?'Network Error':error?.message||error?.response?.data?.message||'Failed to update config',
                loading:false,
            })
        }
    },
    deleteConfig:async(id:string)=>{
        try {
            const res=await axiosInstance.delete(`${API.deleteConfig}${id}`);
            console.log(res);
            set((state)=>({
                configs:state.configs.filter(c=>c._id!==id),
                error:null
            }))
        } catch (error:any) {
            set({
                error:error?.message==='Network error'?'Network Error':error?.message||error?.response?.data?.message||'Failed to delete config',
                loading:false,
            })
        }
    },
    toggleConfigStatus:async(id:string)=>{
    try {
     const res= await axiosInstance.patch(`${API.toggleConfigStatus}${id}`);
      set((state) => ({
        configs: state.configs.map(c => {
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
      set({error:error?.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to toggle config status'})
    }
  }
}))