export interface CategoryFormData {
  name: string;
  description: string;
  slug:string;
  mainCategoryId:string;
  subCategoryId:string;
  image:File|string|null;
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  slug?:string;
  mainCategoryId?:string;
  subCategoryId?:string;
  image?:string;
}

export const validateCategoryForm = (data: CategoryFormData): ValidationErrors => {
  const errors: ValidationErrors = {
  };

  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (data.name.trim().length < 5) {
    errors.name = 'Name must be at least 5 characters long.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  } else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = 'Name must contain at least one letter.';
  }
  if (!data.description) {
    errors.description = 'Description is required.';
  } else if (data.description.trim().length < 30) {
    errors.description = 'Description must be at least 30 characters long.';
  }
  else if (!data.description.trim()) {
    errors.description = 'Description cannot start with space.';
  }else if (!/[a-zA-Z]/.test(data.description)) {
    errors.description = 'Description contain at least one letter.';
  }
  if (!data.mainCategoryId) {
    errors.mainCategoryId = 'Main Category name  is required.';
  }
   if (!data.subCategoryId) {
    errors.subCategoryId = 'Sub Category name  is required.';
  }
   if(data.image instanceof File){
    const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (!allowedTypes.includes(data.image.type)) {
    errors.image = 'Only JPG, JPEG, PNG, WEBP images are allowed';
  }
  }
  
  if(data.slug){
   if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)){
    errors.slug='Invalid slug'
  }
}
  return errors;
};