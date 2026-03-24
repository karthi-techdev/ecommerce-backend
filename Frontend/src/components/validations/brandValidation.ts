export interface BrandFormData {
  name: string;
  description: string;
  img?: File | null;
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  img?: string;
}

export const validateBrandForm = (
  data: BrandFormData,
  isEditMode: boolean = false
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
  errors.name = "Name is required.";
}

  // Description validation
  if (!data.description) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long.";
  }

  // Image validation
  if (!isEditMode && !data.img) {
    errors.img = "Image is required.";
  }

  return errors;
};

