import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { toast } from 'react-toastify';
import { validateGeneralSettings, type GeneralSettingsFormData, type GeneralSettingsErrors } from '../../validations/settingsValidation';

const GeneralSettingTemplate: React.FC<{ isTabbed?: boolean }> = ({ isTabbed }) => {
  const { fetchSettings, updateSettings } = useSettingsStore();
  const [formData, setFormData] = useState<GeneralSettingsFormData>({
    siteName: '', 
    siteDescription: '', 
    address: '', 
    phone: '', 
    email: '', 
    workingHours: '',
    currency: '' 
  });
  const [errors, setErrors] = useState<GeneralSettingsErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings().then(data => { if (data?.generalSettings) setFormData(data.generalSettings); });
  }, [fetchSettings]);

  const handleChange = (e: any) => {
    const name = e.target ? e.target.name : e.name;
    const value = e.target ? e.target.value : e.value;
    const next = { ...formData, [name]: value };
    setFormData(next);
    setErrors(prev => ({ ...prev, [name]: undefined }));
    const fieldErrors = validateGeneralSettings(next);
    if (fieldErrors[name as keyof GeneralSettingsErrors]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name as keyof GeneralSettingsErrors] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validateGeneralSettings(formData);
    if (Object.keys(valErrors).length > 0) return setErrors(valErrors);
    
    setIsSubmitting(true);
    try {
      await updateSettings({ generalSettings: formData });
      toast.success('General settings updated');
    } catch (error) { toast.error('Update failed'); } 
    finally { setIsSubmitting(false); }
  };

  const fields: FieldConfig[] = [
    { name: 'siteName', label: 'Site Name', type: 'text' },
    { name: 'email', label: 'Site Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'workingHours', label: 'Working Hours', type: 'text' },
    { name: 'siteDescription', label: 'Description', type: 'textarea' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'currency', label: 'Currency', type: 'text' }, 
  ];

  return (
    <div className={isTabbed ? "p-4" : "p-6"}>
      {!isTabbed && <FormHeader managementName="General Settings" type="Edit" />}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(f => (
            <div key={f.name} className={f.type === 'textarea' || f.name === 'currency' ? 'md:col-span-2' : ''}>
              <FormField 
                field={f} 
                isRequired 
                value={(formData as any)[f.name]} 
                onChange={handleChange} 
                error={errors[f.name as keyof GeneralSettingsErrors]} 
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="px-10 py-2.5 bg-amber-500 text-white font-bold rounded-lg">
            {isSubmitting ? 'Saving...' : 'Save General Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettingTemplate;