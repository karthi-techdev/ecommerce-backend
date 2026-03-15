export interface OfferFormData {
  name: string;
  banner?: string;
  description?: string;
  buttonName: string;
  products: string[]; 
  isActive?: boolean;
}

export interface OfferValidationErrors {
  name?: string;
  banner?: string;
  description?: string;
  buttonName?: string;
  products?: string;
}

export const validateOfferForm = (
  data: OfferFormData,
): OfferValidationErrors => {
  const errors: OfferValidationErrors = {};

  if (!data.name) {
    errors.name = "Offer name is required.";
  } else if (data.name.startsWith(" ")) {
    errors.name = "Offer name should not start with a space.";
  } else if (data.name.trim().length < 3) {
    errors.name = "Offer name must be at least 3 characters long.";
  } else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = "Offer name must contain at least one letter.";
  }

  if (!data.banner) {
    errors.banner = "Please select a banner.";
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long.";
  }

  if (!data.buttonName) {
    errors.buttonName = "Button text is required.";
  } else if (data.buttonName.trim().length < 2) {
    errors.buttonName = "Button text must be at least 2 characters.";
  }

  if (!data.products || data.products.length === 0) {
    errors.products = "Please select at least one product.";
  } else if (data.products.length > 10) { 
    errors.products = "An offer cannot contain more than 10 products.";
  }

  return errors;
};