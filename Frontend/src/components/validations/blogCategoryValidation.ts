export interface BlogCategoryFormData {
  name: string;
  slug: string;
  isActive: boolean;
}

export const validateBlogCategoryForm = (data: BlogCategoryFormData) => {
  const errors: { name?: string } = {};
  const trimmedName = data.name.trim();

  if (!trimmedName) {
    errors.name = "Name is required";
  } else if (data.name.startsWith(" ")) {
    errors.name = "Name cannot start with a space";
  } else if (trimmedName.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  return errors;
};