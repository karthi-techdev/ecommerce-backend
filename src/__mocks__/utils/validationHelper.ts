const ValidationHelper = {
  isValidObjectId: jest.fn().mockImplementation((value: string | null | undefined, field: string) => {
    if (value === "invalid-id") {
      return { message: `Invalid ${field}` };
    }
    return null;
  }),

  validate: jest.fn().mockImplementation((rules: Array<{ message?: string } | null | undefined> = []) => {
    const filteredRules = rules.filter((rule): rule is { message?: string } => rule !== null && rule !== undefined);
    return filteredRules.map(rule => ({ message: rule.message || 'Mock validation error' }));
  }),

  isRequired: jest.fn().mockImplementation((value: any, field: string) => {
    if (!value) {
      return { message: `${field} is required` };
    }
    return null;
  }),

  maxLength: jest.fn().mockImplementation((value: string, field: string, max: number) => {
    if (value && value.length > max) {
      return { message: `${field} must not exceed ${max} characters` };
    }
    return null;
  }),

  isValidEnum: jest.fn().mockImplementation((value: any, field: string, validValues: string[]) => {
    if (!validValues.includes(value)) {
      return { message: `${field} must be one of: ${validValues.join(', ')}` };
    }
    return null;
  }),

  isBoolean: jest.fn().mockImplementation((value: any, field: string) => {
    if (typeof value !== 'boolean') {
      return { message: `${field} must be a boolean` };
    }
    return null;
  })
};

export default ValidationHelper;
