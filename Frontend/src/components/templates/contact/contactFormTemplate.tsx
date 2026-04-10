import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContactStore } from '../../../stores/contactStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import { validateContactForm } from '../../validations/contactValidation';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const contactFields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter phone number' },
  { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Enter subject' },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter message' },
];

const ContactFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchContactById,
    addContact,
    updateContact
  } = useContactStore();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  type ContactValidationErrors = Partial<Record<keyof ContactFormData, string>>;
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const contact = await fetchContactById(id);
        if (contact) {
          setFormData({
            name: contact.name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            subject: contact.subject || '',
            message: contact.message || '',
          });
        } else {
          toast.error('Failed to load contact data');
        }
      }
    };

    fetchData();
  }, [id, fetchContactById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  const fieldName = name as keyof ContactFormData;
  const updatedData = { ...formData, [fieldName]: value };
  setFormData(updatedData);
  const validation = validateContactForm(updatedData);
  setErrors((prev) => ({
    ...prev,
    [fieldName]: validation[fieldName] || '',
  }));
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (id) {
        await updateContact(id, formData);
        toast.success('Contact updated successfully');
      } else {
        await addContact(formData);
        toast.success('Contact added successfully');
      }

      navigate('/contact');

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
    <div className="p-6">
      <FormHeader
        managementName="Contact"
        addButtonLink="/contact"
        type={id ? 'Edit' : 'Add'}
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
          {contactFields.map(field => {
            const isRequired = true;

            return (
              <FormField
                key={field.name}
                field={{ ...field, className: 'w-full' }}
                isRequired={isRequired}
                value={formData[field.name as keyof ContactFormData] ?? ''}
                onChange={handleChange}
                error={errors[field.name as keyof ContactValidationErrors]}
              />
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-amber-500 text-white rounded"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactFormTemplate;