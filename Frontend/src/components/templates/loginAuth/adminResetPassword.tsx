import React, { useState,useEffect } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateResetPasswordForm, type resetPasswordForm, type resetPasswordValidationErrors } from '../../validations/authValidation';
import { useAuthStore } from '../../../stores/authStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import Admin  from "../../../assets/images/admin.png"

const loginFields: FieldConfig[] = [
  {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    placeholder: 'Enter your new password...',
  },
   {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Re-enter your password...',
  },
];

const ResetPasswordTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams]=useSearchParams();
  const token=searchParams.get('token')||''
  const { resetPassword } = useAuthStore();
  useEffect(() => {
    if (!token) {
      toast.error('Reset token is missing or expired');
      navigate('/login');
    }
  }, [token, navigate]);
  const [formData, setFormData] = useState<resetPasswordForm>({
    newPassword: '',
    confirmPassword:''
  });

  const [errors, setErrors] = useState<resetPasswordValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login=()=>{
    navigate('/login')
  }
  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldValidationErrors = validateResetPasswordForm({
      ...formData,
      [name]: value
    });

    setErrors(prev => ({
      ...prev,
      [name]: fieldValidationErrors[name as keyof resetPasswordValidationErrors]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateResetPasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token,formData.newPassword);
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error: any) {
      const errorMessages = handleError(error);
      for (const message of errorMessages) {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#eef2f7] p-6">
    
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        <div className=" flex items-center justify-center p-10">
          <img
            src={Admin}
            alt="login illustration"
            className="max-h-[320px] object-contain"
          />
        </div>

        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            
            <div className="flex justify-center mb-4">
              <FormHeader 
                managementName="" 
                type="Reset Password" 
              />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {loginFields.map((field) => (
                <div key={field.name} className="relative">
                  
                  <FormField
                    field={{
                      ...field,

                      
                      className: `
                        w-full  border-none rounded-lg px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition
                        ${
                          errors[field.name as keyof resetPasswordForm]
                            ? " ring-red-400"
                            : ""
                        }
                      `,
                    }}
                    value={formData[field.name as keyof resetPasswordForm]}
                    onChange={handleChange}
                    error={
                      errors[field.name as keyof resetPasswordValidationErrors]
                    }
                  />
                </div>
              ))}
            <div className="text-right text-xs text-amber-500 cursor-pointer hover:underline" >
                <button type='button' className='cursor-pointer' onClick={login}>Back to Login?</button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 transition shadow-md disabled:opacity-50 cursor-pointer
                "
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default ResetPasswordTemplate;
