import { create } from "zustand";
import ImportedURL from "../common/urls";
import type{ Slider } from "../types/common";
import axiosInstance from "../components/utils/axios";
const {API}=ImportedURL;
interface sliderStat{
    total:number;
    active:number;
    inactive:number;
}
interface SliderStates{
    sliders:Slider[];
    page:number;
    stats:sliderStat;
    error:string|null;
    loading:boolean;
    totalPages:number;
    addSlider:(data:Slider)=>Promise<void>;
    fetchAllSlider:(page?:number,limit?:number,filter?:'active'|'inactive'|'total')=>Promise<void>;
    fetchSlider:(id:string)=>Promise<Slider|null>;
    updateSlider:(id:string,data:Slider)=>Promise<void>;
    deleteSlider:(id:string)=>Promise<void>;
    toggleSliderStatus:(id:string)=>Promise<void>;
    sliderstats:()=>Promise<void>;
}

export const useSliderStore=create<SliderStates>((set,get)=>({
    sliders:[],
    stats:{
        total:0,
        active:0,
        inactive:0
    },
    error:null,
    loading:false,
    page:1,
    totalPages:1,
    addSlider:async(data:Slider)=>{
        try {
            const formData=new FormData();
            formData.append('title',data.title);
            formData.append('highlightsText',data.highlightsText);
            formData.append('buttonName',data.buttonName);
            formData.append('buttonUrl',data.buttonUrl);
            formData.append('serialNumber',data.serialNumber.toString());
            if(data.image instanceof File){
                formData.append('image',data.image)
            }
            const res=await axiosInstance.post(`${API.addSlider}`,formData);
            set((state)=>({
                sliders:[...state.sliders,res.data.data],
                error:null
            }));
        } catch (error:any) {
            set({
                error:error?.message==='Network error'?'Network error':error?.response?.data?.message||error?.message || 'Failed to add Slider' });
                 throw error?.response?.data?.message || error?.message || error;
        }
    },
    fetchAllSlider:async(page=1,limit=10,filter='total')=>{
        try {
            set({loading:true,error:null});
            const statusParam=filter=='active'?'active':filter=='inactive'?'inactive':'';
            const res=await axiosInstance.get(`${API.listSLider}?page=${page}&limit=${limit}${statusParam?`&status=${statusParam}`:''}`);
            const {data,meta}=res.data.data;
            console.log(res,'from fetch all');
            set({
                sliders:Array.isArray(data)?data:[],
                error:null,
                loading:false,
                totalPages:meta?.totalPages??1
            })
        } catch (error:any) {
      set({
        error: error?.message === 'Network error' ? 'Network error' : error?.message || error?.response?.data?.message || 'Failed to fetch sliders',
        sliders: [],
        stats: { total: 0, active: 0, inactive: 0 },
        loading: false
      });
        }
    },
    fetchSlider:async(id:string)=>{
        try {
            set({error:null,loading:true});
            const res=await axiosInstance.get(`${API.getSliderById}${id}`);
            const slider=res.data.data;
            set((state)=>({
                sliders:state.sliders.some(s=>s._id===id)?state.sliders.map(s=>s._id===id?slider:s):[...state.sliders,slider],
                loading:false
            }))
            return slider;
        } catch (error: any) {
      set({ error: error?.message || error?.response?.data?.message || 'Failed to fetch Category', loading: false });
      return null;
        }
    },
    sliderstats:async()=>{
  try {
    const res=await axiosInstance.get(`${API.sliderStats}`);
    set({
      stats:{
        total:res.data.data.total,
        active:res.data.data.active,
        inactive:res.data.data.inactive
      }
    })
  } catch (error:any) {
      set({        error:error.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to load slider stats',
})
  }
},
    updateSlider:async(id:string,data:Slider)=>{
        try {
             const formData=new FormData();
            formData.append('title',data.title);
            formData.append('highlightsText',data.highlightsText);
            formData.append('buttonName',data.buttonName);
            formData.append('buttonUrl',data.buttonUrl);
            formData.append('serialNumber',data.serialNumber.toString());
            if(data.image instanceof File){
                formData.append('image',data.image)
            }
            const res=await axiosInstance.put(`${API.updateSlider}${id}`,formData);
            set((state)=>({
                sliders:state.sliders.map(s=>s._id===id?{...s,...res.data.data}:s),
                error:null
            }))
        } catch (error: any) {
    set({
      error:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update slider',
    });
    throw error;
        }
    },
    deleteSlider:async(id:string)=>{
        try {
            await axiosInstance.delete(`${API.deleteSlider}${id}`);
            set((state)=>({
                sliders:state.sliders.filter(s=>s._id!==id),
                error:null
            }))
        } catch (error:any) {
      set({
        error:error?.message==='Network Error'?'Network Error':error?.message||error.response.data.message||'Failed to delete Slider'
      })
        }
    },
    toggleSliderStatus:async(id:string)=>{
        try {
           const res= await axiosInstance.patch(`${API.toggleStatusSlider}${id}`);
            set((state)=>({
                sliders:state.sliders.map(s=>{
                    if(s._id===id){
                        return{
                            ...s,status:res.data.data.status
                        };
                    }
                    return s;
                }),
                error:null
            }))
        } catch (error:any) {
      set({error:error?.message==='Network Error'?'Network Error':error?.response?.data?.message||'Failed to toggle slider status'})
        }
    },
}))