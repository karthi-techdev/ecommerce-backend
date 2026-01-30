import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import ButtonLink from '../atoms/ButtonLink';

interface FormHeaderProps {
  type?: string;
  addButtonLink?: string;
  managementName: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ type, addButtonLink, managementName }) => {

 const noBackArrowPages = [
    'Profile',
    'Logo & Favicon',
    'Email Configuration',
    'Change Password',
    'Meta Details',
    'Founder Details',
    'Company Details'
  ]; 
  const hideBackArrow = noBackArrowPages.includes(managementName);

  return (
    <div className="flex items-center mb-6">
      {!hideBackArrow && addButtonLink && (
  <ButtonLink to={addButtonLink} className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4">
    <FiArrowLeft className="mr-1" />
  </ButtonLink>
)}

      <h1 className="text-2xl font-bold text-gray-800">{type} {managementName}</h1>
    </div>
  );
};

export default FormHeader;
