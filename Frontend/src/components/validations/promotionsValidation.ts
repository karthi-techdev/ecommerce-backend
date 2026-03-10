export interface PromotionsFormData {
  name: string;
  image: File | string | null;
  isActive: boolean;
}

export interface ValidationErrors {
  name?: string;
  image?: string;
}

export const validatePromotionsForm = (
  data: PromotionsFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate name
  if (!data.name) {
    errors.name = "Promotion name is required.";
  } else if (data.name.trim().length < 3) {
    errors.name = "Promotion name must be at least 3 characters long.";
  } else if (!data.name.trim()) {
    errors.name = "Promotion name cannot start with space.";
  }

  // Validate image

  if (!data.image) {
    errors.image = "Cover image is required.";
  } else if (data.image instanceof File) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(data.image.type)) {
      errors.image = "Only image files (jpg, jpeg, png, webp) are allowed.";
    }

    // Optional: File size validation (2MB)
    const maxSize = 2 * 1024 * 1024;

    if (data.image.size > maxSize) {
      errors.image = "Image size must be less than 2MB.";
    }
  } else if (typeof data.image === "string") {
    if (!data.image.startsWith("http") && !data.image.includes("blob:")) {
      errors.image = "Invalid image format.";
    }
  }

  return errors;
};
