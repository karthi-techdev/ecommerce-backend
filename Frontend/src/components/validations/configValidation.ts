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

  // ----------------
  // Name Validation
  // ----------------
  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters.';
  }

  // ----------------
  // Options Validation
  // ----------------

  const optionErrors: { key?: string; value?: string }[] = [];
  const keysSeen = new Set<string>();
  const valuesSeen = new Set<string>();

  data.options.forEach((row, index) => {
    const key = row.key.trim();
    const value = row.value.trim();

    optionErrors[index] = {};

    const keyFilled = key !== '';
    const valueFilled = value !== '';

    // Ignore fully empty rows
    if (!keyFilled && !valueFilled) return;

    // Required pair validation
    if (keyFilled && !valueFilled) {
      optionErrors[index].value = 'Value is required.';
    }

    if (!keyFilled && valueFilled) {
      optionErrors[index].key = 'Key is required.';
    }

    // Duplicate key validation
    if (keyFilled) {
      if (keysSeen.has(key.toLowerCase())) {
        optionErrors[index].key = 'Duplicate key not allowed.';
      } else {
        keysSeen.add(key.toLowerCase());
      }
    }

    // Duplicate value validation
    if (valueFilled) {
      if (valuesSeen.has(value.toLowerCase())) {
        optionErrors[index].value = 'Duplicate value not allowed.';
      } else {
        valuesSeen.add(value.toLowerCase());
      }
    }
  });

  // Attach only if any row has error
  if (optionErrors.some(err => Object.keys(err).length > 0)) {
    errors.options = optionErrors;
  }

  return errors;
};
