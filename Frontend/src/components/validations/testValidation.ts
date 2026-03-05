export interface TestimonialFormData {
  name: string;
  designation: string;
  message: string;
  image?: File | null;
  rating: number;
}

export interface ValidationErrors {
  name?: string;
  designation?: string;
  message?: string;
  image?: string;
  rating?: Number;

}

export const validateTestimonialForm = (
  data: TestimonialFormData,
  isEditMode: boolean = false
): ValidationErrors => {
  const errors: ValidationErrors = {};

  //name validation
  if (!data.name) {
    errors.name = ' name is required.';
  }
  else if (data.name.trim().length < 3) {
    errors.name = ' name must be at least 3 characters long.';
  }

  //message validation
  if (!data.message) {
    errors.message = "Message is required.";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  if (!isEditMode && !data.image) {
    errors.image = 'Image is required';
  }

  return errors;
};