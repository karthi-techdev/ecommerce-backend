import { Types } from 'mongoose';
import { IConfig,ConfigModel } from '../models/configModel';
import configRepository from '../repositories/configRepository'
import { CommonService } from './commonService';
import ValidationHelper from '../utils/validationHelper';
class configService{
    private commonService=new CommonService<IConfig>(ConfigModel);
    private validateConfigData(data:Partial<IConfig>,isUpdate:boolean=false):void{
        const rules:any=[];
        if(!isUpdate){
             rules.push(ValidationHelper.isRequired(data.name,'name')||(data.name!==undefined?ValidationHelper.isNonEmptyString(data.name.trim(),'name'):null)||(data.name!==undefined?ValidationHelper.minLength(data.name.trim(),'name',3):null))
        }
        if(!isUpdate){
            rules.push(ValidationHelper.isRequired(data.slug,'slug')||(data.slug!==undefined?ValidationHelper.isNonEmptyString(data.slug.trim(),'slug'):null))
        }
        if(data.options){
            const values=new Set<string>();
            data.options.forEach((option:any,index:number)=>{
                if(!option.key || option.key.trim()===''){
                    throw new Error(`Option key is required at index ${index}`)
                }
                if(!option.value|| option.value.trim()===''){
                    throw new Error(`Option value is required at index ${index}`)
                }
                values.add(option.value.trim());
            })
        }
        const errors=ValidationHelper.validate(rules);
        if(errors.length>0){
            throw new Error(errors.map(e=>e.message).join(', '));
        }
    }
    async validateSlug(name:string){
   const regex=/^[a-z0-9]+(-[a-z0-9]+)*$/
   return regex.test(name);
  }
    async createConfig(data:Partial<IConfig>):Promise<IConfig>{
        this.validateConfigData(data);
        if(data.slug){
            const isValid=await this.validateSlug(data.slug)
            if(!isValid){
                throw new Error("Invalid slug");
            }
            const isExist=await configRepository.slugExist(data.slug);
           if(isExist.length>0){
                throw new Error("Name already exists");
            }
        }
        if(data.name)
        data.name=data.name[0].toUpperCase()+data.name.slice(1);
        return await configRepository.createConfig(data);
    }
    async getAllConfig(page=1,limit=10,filter?:string){
        return await configRepository.getAllConfig(page,limit,filter);
    }
    async getConfigById(id:Types.ObjectId|string):Promise<IConfig|null>{
        const error=ValidationHelper.isValidObjectId(id,'id');
        if(error){
            throw new Error(error.message);
        }
        return await configRepository.getConfigById(id);
    }
     async getStats(){
        return await configRepository.getStats();
      }
      async toggleStatus(id:string):Promise<IConfig|null>{
          return  await configRepository.toggleStatus(id);
        }
    async updateConfig(id:string|Types.ObjectId,data:Partial<IConfig>):Promise<IConfig|null>{
        const error=ValidationHelper.isValidObjectId(id,'id');
        if(error){
            throw new Error(error.message);
        }
        this.validateConfigData(data,true);
        return await configRepository.updateConfig(id,data);
    }
    async deleteConfig(id:string|Types.ObjectId):Promise<IConfig|null>{
        const error=ValidationHelper.isValidObjectId(id,'id');
        if(error){
            throw new Error(error.message);
        }
        return await configRepository.deleteConfig(id);
    }
}
export default new configService;