export interface SubCategoryFormData {
  name: string;
  slug: string;
  description?: string;
  mainCategoryId: string;
  image?: File | null;
  isActive?: boolean;
}

export interface ValidationErrors {
  name?: string;
  slug?: string;
  description?: string;
  mainCategoryId?: string;
  image?: string;
}

export const validateSubCategoryForm = (
  data: SubCategoryFormData, isEdit = false): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  }else if (data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters long.';
  } else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = 'Name must contain at least one letter.';
  }

  if (data.description) {
    if (data.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long.';
    } else if (!/[a-zA-Z]/.test(data.description)) {
      errors.description = 'Description must contain at least one letter.';
    }
  }

  if (!data.mainCategoryId) {
    errors.mainCategoryId = 'Main Category is required.';
  }
  if (!isEdit && !data.image) {
    errors.image = 'Image is required';
  }
  if (data.image) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(data.image.type)) {
      errors.image = 'Only JPG, PNG, or WEBP images are allowed.';
    }
  }

  return errors;
};
