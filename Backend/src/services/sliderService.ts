import sliderRepository from '../repositories/sliderRepository';
import ValidationHelper from '../utils/validationHelper';
import { Types } from 'mongoose';
import { ISLider,SliderModel } from '../models/sliderModel';
import { CommonService } from './commonService';

class sliderService{
    private commonService=new CommonService<ISLider>(SliderModel);
    private validateSliderData(data:Partial<ISLider>,isUpdate:boolean=false):void{
        const rules=[
            !isUpdate?(ValidationHelper.isRequired(data.title,'title')||(data.title?.trim()!==undefined?ValidationHelper.isNonEmptyString(data.title.trim(),'title'):null)||(data.title?.trim()!==undefined?ValidationHelper.minLength(data.title?.trim(),'title',5):null)):null,

            !isUpdate?(ValidationHelper.isRequired(data.image,'image')):null,

            !isUpdate?(ValidationHelper.isRequired(data.serialNumber,'Serial number')||(data.serialNumber!==undefined?ValidationHelper.isNumber(Number(data.serialNumber),'Serial number'):null)):null,

            !isUpdate?(data.buttonName?.trim()!==''?(data.buttonUrl?.trim()!==undefined?ValidationHelper.isNonEmptyString(data.buttonUrl.trim(),'Button url'):null):null):null,

           isUpdate && data.title !== undefined?(
      ValidationHelper.isNonEmptyString(data.title.trim(), 'Title') ||
      ValidationHelper.minLength(data.title.trim(), 'Title', 5)): null,

      isUpdate && data.buttonUrl!==undefined?( data.buttonName?.trim()!==''?ValidationHelper.isNonEmptyString(data.buttonUrl.trim(), 'Button url'):null):null,

      isUpdate?(data.serialNumber!==undefined?ValidationHelper.isNumber(Number(data.serialNumber),'Serial number'):null):null
        ]
        if (isUpdate && data.serialNumber !== undefined) {
  if (data.serialNumber.toString() == '') {
    rules.push({
      field: 'serialNumber',
      message: 'Serial Number cannot be null'
    });
  } 
}
        if(data.buttonName?.trim()!=''){
            if(data.buttonUrl!==undefined && data.buttonUrl.trim()!==''){
            if(!/^\/([A-Za-z0-9-]+(\/[A-Za-z0-9-]+)*)$/.test(data?.buttonUrl)){
                rules.push({field:data.buttonUrl,message:`Button url is invalid`})
            }
        }
        }
        
        
        const errors=ValidationHelper.validate(rules);
        if(errors.length>0){
            throw new Error(errors.map(e=>e.message).join(', '));
        }
    }
    async createSlider(data:Partial<ISLider>){
        this.validateSliderData(data);
        if(data.serialNumber){
            const isExist=await sliderRepository.existByField(data.serialNumber);
            if(isExist){
                throw new Error('Serial number already exists');
            }
        }
        data.title=data.title?data.title[0].toUpperCase()+""+data.title.slice(1):'';
        data.buttonName=data.buttonName?data.buttonName[0].toUpperCase()+""+data.buttonName.slice(1):''
        data.highlightsText=data.highlightsText?data.highlightsText[0].toUpperCase()+""+data.highlightsText.slice(1):'';
        return await sliderRepository.createSlider(data);
    }
    async getAllSlider(page=1,limit=10,filter?:string){
        return await sliderRepository.getAllSlider(page,limit,filter);
    }
    async getSliderById(id:string|Types.ObjectId){
        return await sliderRepository.getSliderById(id);
    }
    async getStats(){
        return await sliderRepository.getStats();
      }
    async updateSlider(id:string|Types.ObjectId,data:Partial<ISLider>){
        this.validateSliderData(data,true)
        if(data.serialNumber){
            const isExist=await sliderRepository.existByField(data.serialNumber);
            if(isExist?.id!==id){
                throw new Error('Serial number already exists');
            }
        }
        if(data.title)
        data.title=data.title[0].toUpperCase()+""+data.title.slice(1);
        if(data.buttonName)
        data.buttonName=data.buttonName[0].toUpperCase()+""+data.buttonName.slice(1);
    if(data.highlightsText)
        data.highlightsText=data.highlightsText[0].toUpperCase()+""+data.highlightsText.slice(1);
        return await sliderRepository.updateSlider(id,data);
    }
    async deleteSlider(id:string|Types.ObjectId){
        return await sliderRepository.deleteSlider(id);
    }
    async toggleStatus(id:string){
        return await this.commonService.toggleStatus(id);
    }
}
export default new sliderService;