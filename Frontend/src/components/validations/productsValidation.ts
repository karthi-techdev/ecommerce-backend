import type { ProductFormData } from "../../types/common";
export interface ProductValidationErrors {
  name?: string;         
  slug?: string;
  price?: string;
  discountPrice?: string;
  stockQuantity?: string;
  brandId?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
  categoryId?: string; 
  images?: string;
  thumbnail?: string;
  title?: string;
  type?: string;
}

export const validateProductForm = (
  data: ProductFormData,
  isEdit: boolean = false
): ProductValidationErrors => {

  const errors: ProductValidationErrors = {};

  if (!data.name) {
    errors.name = "Name is required.";
  } 
  else if (data.name.startsWith(" ")) {
    errors.name = "Name should not start with space.";
  }
  else if (data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters long.";
  } 
  else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = "Name must contain at least one letter.";
  }


  if (data.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
    errors.slug = "Invalid slug format.";
  }

 
  if (data.price === '' || data.price === undefined) {
    errors.price = "Price is required.";
  } else if (Number(data.price) <= 0) {
    errors.price = "Price must be greater than 0.";
  }


  if (data.discountPrice === '' || data.discountPrice === undefined) {
    errors.discountPrice = "Discount price is required.";
  }
  else if (Number(data.discountPrice) < 0) {
    errors.discountPrice = "Discount price cannot be negative.";
  } 
  else if (Number(data.discountPrice) >= Number(data.price)) {
    errors.discountPrice = "Discount price must be less than regular price.";
  }

  
  if (data.stockQuantity === '' || data.stockQuantity === undefined) {
    errors.stockQuantity = "Stock quantity is required.";
  } else if (Number(data.stockQuantity) < 0) {
    errors.stockQuantity = "Stock cannot be negative.";
  }
   
  
  
  if (!data.brandId) {
    errors.brandId = "Brand is required.";
  }

  if (!data.mainCategoryId) {
    errors.mainCategoryId = "Main Category is required.";
  }

  if (!isEdit && !data.thumbnail) {
    errors.thumbnail = "Thumbnail is required.";
  }

  if (!data.title) {
    errors.title = "Title is required";
  }
  else if (data.title.trim().length < 30) {
    errors.title = "Title must be minimum 30 characters";
  }

  if (!data.type) {
  errors.type = "Product type is required";
}
  return errors;

  
};
