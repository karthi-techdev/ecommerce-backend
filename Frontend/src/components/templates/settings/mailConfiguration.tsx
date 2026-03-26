import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import { toast } from 'react-toastify';
import type { InputType } from '../../../types/common';
import { validateMailConfig, type MailConfigFormData, type MailConfigErrors } from '../../validations/settingsValidation';

const MailConfigurationTemplate: React.FC<{ isTabbed?: boolean }> = ({ isTabbed }) => {
  const { fetchSettings, updateSettings } = useSettingsStore();
  const [formData, setFormData] = useState<MailConfigFormData>({
    mailHost: '', mailPort: 587, mailUsername: '', mailPassword: '', mailEncryption: 'tls', mailFromAddress: '', mailFromName: ''
  });
  const [errors, setErrors] = useState<MailConfigErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings().then(data => { if (data?.mailConfiguration) setFormData(data.mailConfiguration as MailConfigFormData); });
  }, [fetchSettings]);

  const handleChange = (e: any) => {
    const name = e.target ? e.target.name : e.name;
    let value = e.target ? e.target.value : e.value;
    if (name === 'mailPort') value = value === '' ? 0 : Number(value);
    const next = { ...formData, [name]: value };
    setFormData(next);
    setErrors(prev => ({ ...prev, [name]: undefined }));
    const fieldErrors = validateMailConfig(next);
    if (fieldErrors[name as keyof MailConfigErrors]) setErrors(prev => ({ ...prev, [name]: fieldErrors[name as keyof MailConfigErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validateMailConfig(formData);
    if (Object.keys(valErrors).length > 0) return setErrors(valErrors);
    setIsSubmitting(true);
    try {
      await updateSettings({ mailConfiguration: formData });
      toast.success('SMTP updated');
    } catch (error) { toast.error('Update failed'); } 
    finally { setIsSubmitting(false); }
  };

  return (
    <div className={isTabbed ? "p-4" : "p-6"}>
      {!isTabbed && <FormHeader managementName="Mail Configuration" type="Edit" />}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(formData) as Array<keyof MailConfigFormData>).map(key => (
            <FormField
              key={key}
              field={{ 
                name: key, 
                label: key.replace('mail', 'Mail '), 
                type: (key === 'mailPassword' ? 'password' : key === 'mailPort' ? 'number' : 'text') as InputType 
              }}
              isRequired value={formData[key]} onChange={handleChange} error={errors[key]}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="px-10 py-2.5 bg-amber-500 text-white font-bold rounded-lg">
            {isSubmitting ? 'Saving...' : 'Update SMTP'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MailConfigurationTemplate;

