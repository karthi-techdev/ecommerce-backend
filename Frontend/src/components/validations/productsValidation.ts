export interface ProductFormData {
  name: string;
  description: string;
  slug: string;
  price: number | '';
  discountPrice?: number | '';
  stockQuantity: number | '';
  brandId: string;
  mainCategoryId: string;
  subCategoryId: string;
  categoryId: string; 
   images: (File | string)[];
  thumbnail: File | string | null;   
}

export interface ProductValidationErrors {
  name?: string;
  description?: string;
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


  if (!data.description) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long.";
  } else if (!/[a-zA-Z]/.test(data.description)) {
    errors.description = "Description must contain at least one letter.";
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

  return errors;
};
