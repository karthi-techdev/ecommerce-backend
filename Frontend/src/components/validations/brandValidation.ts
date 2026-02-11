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
  if (!data.name) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters long.";
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

