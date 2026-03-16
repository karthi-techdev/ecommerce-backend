export interface BlogFormData {
  name: string;
  slug: string;
  categoryId: string;
  isActive: boolean;
}

export const validateBlogForm = (data: BlogFormData) => {
  const errors: { name?: string; categoryId?: string } = {};
  const trimmed = data.name.trim();

  if (!trimmed) errors.name = "Name is required";
  else if (data.name.startsWith(" ")) errors.name = "Name cannot start with space";
  else if (trimmed.length < 3) errors.name = "Name must be at least 3 characters";

  if (!data.categoryId) errors.categoryId = "Category is required";

  return errors;
};