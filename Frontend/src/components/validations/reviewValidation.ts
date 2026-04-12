export interface ReviewFormData {
  name: string;
  email: string;
  website?: string;
  rating: string | number;
  comment: string;
  productId: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  website?: string;
  rating?: string;
  comment?: string;
}

export const validateReviewForm = (data: ReviewFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  const ratingNum = Number(data.rating);
  if (!data.rating) {
    errors.rating = "Rating is required.";
  } else if (ratingNum < 1 || ratingNum > 5) {
    errors.rating = "Rating must be between 1 and 5.";
  }

  if (!data.comment) {
    errors.comment = "Comment is required.";
  } else if (data.comment.trim().length < 10) {
    errors.comment = "Comment must be at least 10 characters long.";
  }

  if (data.website && data.website.trim() !== "") {
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(data.website)) {
      errors.website =
        "Please enter a valid website URL (e.g., https://example.com).";
    }
  }

  if (!data.productId) {
    console.warn("Validation Warning: Product ID is missing.");
  }

  return errors;
};
