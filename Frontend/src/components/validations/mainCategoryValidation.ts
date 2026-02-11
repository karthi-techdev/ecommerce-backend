export interface MainCategoryFormData {
  name: string;
  slug: string;
  description?: string;
  image?: File | string | null;
  isActive?: boolean;
}

export interface ValidationErrors {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
}

export const validateMainCategoryForm = (
  data: MainCategoryFormData,
  isEdit: boolean,
): ValidationErrors => {
  const errors: ValidationErrors = {};

 
  if (!data.name || data.name.trim().length === 0) {
  errors.name = 'Name is required';
} else if (data.name.startsWith(' ')) {
  errors.name = 'Name should not start with space';
} else if (data.name.trim().length < 3) {
  errors.name = 'Name must contain at least 3 characters';
}


  if (!data.description || !data.description.trim()) {
  errors.description = 'Description is required';
} else if (data.description.trim().length < 10) {
  errors.description = 'Description must be at least 10 characters';
} else if (data.description.trim().length > 255) {
  errors.description = 'Description must not exceed 255 characters';
}

 if (!isEdit && !data.image) {
  errors.image = 'Image is required';
}


  return errors;
};

