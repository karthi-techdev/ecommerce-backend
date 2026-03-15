import { SliderModel,ISLider } from "../models/sliderModel";
import { Types } from "mongoose";

class sliderRepository{
    async createSlider(data:Partial<ISLider>):Promise<ISLider>{
        return await SliderModel.create(data);
    }
    async getAllSlider(page=1,limit=10,filter?:string){
        try {
            const skip=(page-1)*limit;
        const query:any={};
        if(filter=='active')query.status='active';
        if(filter=='inactive')query.status='inactive';
        const [data,totalCount]=await Promise.all([
            SliderModel.find(query).skip(skip).limit(limit).sort({createdAt:-1,updatedAt:-1}).exec(),
            SliderModel.countDocuments(query)
        ]);
        const totalPages=Math.ceil(totalCount/limit)||1;
        return {data,meta:{
            total:totalCount,
            totalPages,
            page,
            limit
        }}
        } catch (error) {
            throw error;
        }
    }
    async getSliderById(id:string|Types.ObjectId):Promise<ISLider|null>{
        return await SliderModel.findById(id);
    }
    async getStats(){
          const total=await SliderModel.find().countDocuments();
          const active=await SliderModel.find({status:'active'}).countDocuments();
          const inactive=total-active;
          return {total,active,inactive};
        }
    async updateSlider(id:string|Types.ObjectId,data:Partial<ISLider>):Promise<ISLider|null>{
        return await SliderModel.findByIdAndUpdate(id,data,{new:true});
    }
    async deleteSlider(id:string|Types.ObjectId):Promise<ISLider|null>{
        return await SliderModel.findByIdAndDelete(id);
    }
    async existByField(data:number):Promise<ISLider|null>{
        return await SliderModel.findOne({serialNumber:data});
    }
}
export default new sliderRepository;