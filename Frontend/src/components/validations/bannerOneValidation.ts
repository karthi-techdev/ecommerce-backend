export interface BannerOneFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonName: string;
  buttonUrl: string;
  image?: File | null;
}

export interface validationErrors {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonName?: string;
  buttonUrl?: string;
  image?: string;
}

export const validateBannerOneForm = (
  data: BannerOneFormData,
  isEditMode: boolean = false
): validationErrors => {

  const errors: validationErrors = {};

  if (!data.title ) {
    errors.title = "Title is required";
    }else if( data.title.trim().length < 3){
    errors.title = "Title must be at least 3 characters.";
  }

  if (!data.subtitle ){
    errors.subtitle = "Subtitle is required";
  } else if( data.subtitle.trim().length < 3){
    errors.subtitle = "Subtitle must be at least 3 characters.";
  }

  if (!data.description){
    errors.description = "Description is required";
  }else if (data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  if (!data.buttonName) {
    errors.buttonName = "Button name is required.";
  }

 if (!data.buttonUrl) {
    errors.buttonUrl = "Button URL is required.";
  }else{
   const isRelative = data.buttonUrl.startsWith("/");
   try{
    if(!isRelative) new URL(data.buttonUrl);;
    }catch{
      errors.buttonUrl = "Enter a valid URL.";
    }
}

  if (!isEditMode && !data.image) {
    errors.image = "Image is required.";
  }


  return errors;
};

