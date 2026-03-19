export interface SliderFormData {
      title:string;
      image:string | File | null;
      highlightsText:string;
      serialNumber:number;
      buttonName:string;
      buttonUrl:string;
}

export interface ValidationErrors {
   title?: string;
  highlightsText?: string;
  serialNumber?:string;
  buttonUrl?:string;
  buttonName?:string;
  image?:string ;
}

export const validateSliderForm = (data: SliderFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.title) {
    errors.title = 'Title is required.';
  } else if (!data.title.trim()) {
    errors.title = 'Title cannot start with space.';
  } else if (data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
  } else if (!/[a-zA-Z]/.test(data.title)) {
    errors.title = 'Title must contain at least one letter.';
  }
  if(data.highlightsText){
    if (!/[a-zA-Z]/.test(data.highlightsText)) {
    errors.highlightsText = 'Highlights Text must contain at least one letter.';
  }
  }
  if(data.buttonName){
    if(!data.buttonUrl){
      errors.buttonUrl = "Button URL required"
  }
  }
   
  if(data.buttonUrl){
    if(!/^\/([A-Za-z0-9-]+(\/[A-Za-z0-9-]+)*)$/.test(data?.buttonUrl)){
      errors.buttonUrl = "Invalid URL"
    }
  }
  if(!data.image){
    errors.image='Image is required'
  }
  if (data.serialNumber === null || data.serialNumber === undefined) {
  errors.serialNumber = 'Serial Number is required';
} else if (isNaN(Number(data.serialNumber))) {
  errors.serialNumber = 'Number only';
}

  return errors;
};