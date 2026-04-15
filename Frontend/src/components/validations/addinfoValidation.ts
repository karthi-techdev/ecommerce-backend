export interface AddInfoFormData {
  key: string;
  value: string;
}

export interface ValidationErrors {
  key?: string;
  value?: string;
}

export const validateAddInfoForm = (data: AddInfoFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.key) {
    errors.key = 'Key is required.';
  }else if (data.key !== data.key.trimStart()) {
    errors.key = 'Key cannot start with a space.';
  }  else if (data.key.trim().length < 3) {
    errors.key = 'Key must be at least 2 characters';
  } else if (!/[a-zA-Z0-9]/.test(data.key)) {
    errors.key = 'Key must contain at least one letter or number.';
  }

  if (!data.value) {
    errors.value = 'Value is required.';
  } else if (data.value.trim().length < 1) {
    errors.value = 'Value must not be empty.';
  } else if (data.value !== data.value.trimStart()) {
    errors.value = 'Value cannot start with a space.';
  }

  return errors;
};