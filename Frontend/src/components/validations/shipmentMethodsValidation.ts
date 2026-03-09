export interface ShipmentMethodFormData {
  name: string;
  slug: string;
  description?: string;
  price: string;
  status?: 'active' | 'inactive';
}

export interface ShipmentMethodValidationErrors {
  name?: string;
  slug?: string;
  description?: string;
  price?: string;
  estimatedDeliveryTime?: string;
  status?: string;
}

export const validateShipmentMethodForm = (
  data: ShipmentMethodFormData,
  isEdit = false
): ShipmentMethodValidationErrors => {
  const errors: ShipmentMethodValidationErrors = {};

  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  } else if (data.name.trim().length < 3) {
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

 if (!data.price) {
    errors.price = 'Price is required.';
  } 
  else if (isNaN(Number(data.price))) {
    errors.price = 'Price must be a valid number.';
  } 
  else if (Number(data.price) < 0) {
    errors.price = 'Price must be greater than or equal to 0.';
  }

  return errors;
};
