import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { validateLoginForm, type LoginFormData, type ValidationErrors } from '../../validations/authValidation';
import { useAuthStore } from '../../../stores/authStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import Admin  from "../../../assets/images/admin.png"

const loginFields: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email...',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password...',
  },
];

const LoginFormTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldValidationErrors = validateLoginForm({
      ...formData,
      [name]: value
    });

    setErrors(prev => ({
      ...prev,
      [name]: fieldValidationErrors[name as keyof ValidationErrors]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData);
      toast.success('Welcome back, Admin!');
      navigate('/dashboard');
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
                type="Login" 
              />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {loginFields.map((field) => (
                <div key={field.name} className="relative">
                  
                  <FormField
                    field={{
                      ...field,
                      type:
                        field.name === "password" && showPassword
                          ? "text"
                          : field.type,

                      
                      className: `
                        w-full  border-none rounded-lg px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition
                        ${
                          errors[field.name as keyof ValidationErrors]
                            ? " ring-red-400"
                            : ""
                        }
                      `,
                    }}
                    value={formData[field.name as keyof LoginFormData]}
                    onChange={handleChange}
                    error={
                      errors[field.name as keyof ValidationErrors]
                    }
                  />

                  {field.name === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-8 top-[38px] text-gray-400 hover:text-amber-500 transition"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  )}
                </div>
              ))}

              <div className="text-right text-xs text-amber-500 cursor-pointer hover:underline">
                Forgot Password?
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 transition shadow-md disabled:opacity-50 cursor-pointer
                "
              >
                {isSubmitting ? "Authenticating..." : "Sign in"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default LoginFormTemplate;

// bg-[#f5f7fb]