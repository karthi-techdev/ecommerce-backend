export interface BannerTwoFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonName: string;
  buttonUrl: string;
  imageone?: File | null;
  imagetwo?: File | null;
  imagethree?: File | null;
}

export interface validationErrors {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonName?: string;
  buttonUrl?: string;
  imageone?: string;
  imagetwo?: string;
  imagethree?: string;
}

export const validateBannerTwoForm = (
    data: BannerTwoFormData,
    isEditMode: boolean = false
): validationErrors =>{

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

  if (!isEditMode && !data.imageone) {
    errors.imageone = "Imageone is required.";
  }

  
  if (!isEditMode && !data.imagetwo) {
    errors.imagetwo = "Imagetwo is required.";
  }


  if (!isEditMode && !data.imagethree) {
    errors.imagethree = "Imagethree is required.";
  }

  return errors;
};

