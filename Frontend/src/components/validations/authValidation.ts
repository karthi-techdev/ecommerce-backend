export interface LoginFormData {
  email: string;
  password?: string;
}
export interface forgetPasswordForm{
  email:string;
}
export interface ValidationErrors {
  email?: string;
  password?: string;
}
export interface forgetPasswordValidationErrors{
  email?:string;
}
export const validateForgetPasswordForm = (data: forgetPasswordForm): forgetPasswordValidationErrors => {
const errors: ValidationErrors = {};
 
 
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email.toString())) {
    errors.email = 'Please enter a valid email address';
  }
  return errors;
}
export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
 
 
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};