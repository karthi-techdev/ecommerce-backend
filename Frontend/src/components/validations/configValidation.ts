export interface ConfigFormData {
  name: string;
  slug: string;
  options: {
    key: string;
    value: string;
  }[];
}

export interface ConfigValidationErrors {
  name?: string;
  options?: {
    key?: string;
    value?: string;
  }[];
}
export const validateConfigForm = (
  data: ConfigFormData
): ConfigValidationErrors => {

  const errors: ConfigValidationErrors = {};

  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters.';
  }


  const optionErrors: { key?: string; value?: string }[] = [];
  data.options.forEach((row, index) => {
    const key = row.key.trim();
    const value = row.value.trim();

    optionErrors[index] = {};

    const keyFilled = key !== '';
    const valueFilled = value !== '';

    if (!keyFilled && !valueFilled) return;

    if (keyFilled && !valueFilled) {
      optionErrors[index].value = 'Value is required.';
    }

    if (!keyFilled && valueFilled) {
      optionErrors[index].key = 'Key is required.';
    }
  });

  if (optionErrors.some(err => Object.keys(err).length > 0)) {
    errors.options = optionErrors;
  }

  return errors;
};
