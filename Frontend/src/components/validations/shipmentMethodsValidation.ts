export interface ShipmentMethodFormData {
  name: string;
  slug: string;
  price: number;
  estimatedDeliveryTime: string;
  status?: 'active' | 'inactive';
}

export interface ValidationErrors {
  name?: string;
  slug?: string;
  price?: string;
  estimatedDeliveryTime?: string;
}

export const validateShipmentMethodForm = (
  data: ShipmentMethodFormData,
  isEdit = false
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // ✅ Name Validation
  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters long.';
  } else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = 'Name must contain at least one letter.';
  }

  // ✅ Price Validation
  if (data.price === undefined || data.price === null) {
    errors.price = 'Price is required.';
  } else if (isNaN(data.price)) {
    errors.price = 'Price must be a valid number.';
  } else if (data.price < 0) {
    errors.price = 'Price cannot be negative.';
  }

  // ✅ Estimated Delivery Time Validation
  if (!data.estimatedDeliveryTime) {
    errors.estimatedDeliveryTime = 'Estimated delivery time is required.';
  } else if (!data.estimatedDeliveryTime.trim()) {
    errors.estimatedDeliveryTime =
      'Estimated delivery time cannot start with space.';
  } else if (data.estimatedDeliveryTime.trim().length < 3) {
    errors.estimatedDeliveryTime =
      'Estimated delivery time must be at least 3 characters long.';
  } else if (!/[a-zA-Z0-9]/.test(data.estimatedDeliveryTime)) {
    errors.estimatedDeliveryTime =
      'Estimated delivery time must contain valid characters.';
  }

  return errors;
};