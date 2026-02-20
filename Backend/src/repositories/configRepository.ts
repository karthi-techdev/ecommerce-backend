import {IConfig,ConfigModel} from '../models/configModel'
import {Types} from 'mongoose'
import { CommonRepository } from './commonRepository';
class configRepository{
     private commonRepository:CommonRepository<IConfig>;
        constructor(){
            this.commonRepository=new CommonRepository(ConfigModel);
        }
    async createConfig(data:Partial<IConfig>):Promise<IConfig>{
        return await ConfigModel.create(data);
    }
    async getAllConfig(page=1,limit=10,filter?:string){
    let query:any={};
    const skip=(page-1)*limit;

    if (filter === 'active') query.status = 'active';
    if (filter === 'inactive') query.status = 'inactive';

    const [data, total] = await Promise.all([
        ConfigModel.find(query)
            .skip(skip)
            .limit(limit)
            .sort({createdAt:-1}),
        ConfigModel.countDocuments(query)   
    ]);

    return {
        data,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

    async getConfigById(id:Types.ObjectId|string):Promise<IConfig|null>{
        return await ConfigModel.findById(id);
    }
    async getStats(){
          const total=await ConfigModel.find().countDocuments();
          const active=await ConfigModel.find({status:'active'}).countDocuments();
          const inactive=await ConfigModel.find({status:'inactive'}).countDocuments();
          return {total,active,inactive};
        }
    async updateConfig(id:string|Types.ObjectId,data:Partial<IConfig>):Promise<IConfig|null>{
        return await ConfigModel.findByIdAndUpdate(id,{$set:data},{new:true});
    }
    async deleteConfig(id:string|Types.ObjectId):Promise<IConfig|null>{
        return await ConfigModel.findByIdAndDelete(id);
    }
    async slugExist(slug:string):Promise<IConfig[]>{
        return await ConfigModel.find({slug});
    }
    async toggleStatus(id:string):Promise<IConfig|null>{
          return await this.commonRepository.toggleStatus(id);
        }
}
export default new configRepository;