export interface LoginFormData {
  email: string;
  password?: string;
}
export interface forgetPasswordForm{
  email:string;
}
export interface resetPasswordForm{
  newPassword:string;
  confirmPassword:string;
}
export interface ValidationErrors {
  email?: string;
  password?: string;
}
export interface forgetPasswordValidationErrors{
  email?:string;
}
export interface resetPasswordValidationErrors{
  newPassword?:string;
  confirmPassword?:string;
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
export const validateResetPasswordForm = (data: resetPasswordForm): resetPasswordValidationErrors => {
const errors: resetPasswordValidationErrors = {};
 
 
  if (!data.newPassword) {
    errors.newPassword = 'New Password is required';
  } else if (data.newPassword.length < 6) {
    errors.newPassword = 'New Password must be at least 6 characters';
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = 'New Password is required';
  } else if (data.confirmPassword.length < 6) {
    errors.confirmPassword = 'Confirm Password must be at least 6 characters';
  }
  if(data.newPassword){
    if(data.confirmPassword){
      if(data.confirmPassword!=data.newPassword){
        errors.confirmPassword="Password do not match"
      }
    }
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