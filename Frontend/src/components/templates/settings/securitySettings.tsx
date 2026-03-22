import React, { useState } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import { toast } from 'react-toastify';
import { validateSecuritySettings, type SecuritySettingsFormData } from '../../validations/settingsValidation';
import { Eye, EyeOff } from 'lucide-react'; 

const SecuritySettingTemplate: React.FC<{ isTabbed?: boolean }> = ({ isTabbed }) => {
  const { updateSettings } = useSettingsStore();
  const [formData, setFormData] = useState<SecuritySettingsFormData>({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validateSecuritySettings(formData);
    if (Object.keys(valErrors).length > 0) return setErrors(valErrors);
    
    setIsSubmitting(true);
    try {
      await updateSettings(formData);
      toast.success('Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) { 
      toast.error(error?.response?.data?.message || 'Password update failed'); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className={isTabbed ? "p-4" : "p-6"}>
      {!isTabbed && <FormHeader managementName="Security Settings" type="Edit" />}
      <form onSubmit={handleSubmit} noValidate >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-4xl">
          
          <div className="relative">
            <FormField 
              field={{ 
                name: 'currentPassword', 
                label: 'Current Password', 
                type: showCurrent ? 'text' : 'password' 
              }} 
              isRequired 
              value={formData.currentPassword} 
              onChange={handleChange} 
              error={errors.currentPassword} 
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-amber-500 transition-colors"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <FormField 
              field={{ 
                name: 'newPassword', 
                label: 'New Password', 
                type: showNew ? 'text' : 'password' 
              }} 
              isRequired 
              value={formData.newPassword} 
              onChange={handleChange} 
              error={errors.newPassword} 
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-amber-500 transition-colors"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <FormField 
              field={{ 
                name: 'confirmPassword', 
                label: 'Confirm New Password', 
                type: showConfirm ? 'text' : 'password' // Dynamic type
              }} 
              isRequired 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              error={errors.confirmPassword} 
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-amber-500 transition-colors"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

        </div>

        <div className="mt-8 flex justify-start">
          <button type="submit" disabled={isSubmitting} className="px-10 py-2.5 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-colors">
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettingTemplate;