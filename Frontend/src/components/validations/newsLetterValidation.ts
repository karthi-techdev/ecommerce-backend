export interface NewsLetterFormData {
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  isPublished: boolean;
}

export interface ValidationErrors {
  name?: string;
  slug?: string;
}

export const validateNewsLetterForm = (data: NewsLetterFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate name
  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  } else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = 'Name must contain at least one letter.';
  }

  // Validate slug
  if (!data.slug) {
    errors.slug = 'Slug is required.';
  } else if (!data.slug.trim()) {
    errors.slug = 'Slug cannot start with space.';
  } else if (!/[a-zA-Z]/.test(data.slug)) {
    errors.slug = 'Slug must contain at least one letter.';
  }
  return errors;
};