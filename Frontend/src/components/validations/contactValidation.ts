export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status?: 'active' | 'inactive';
}

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status?: string;
}
export const validateContactForm = (
  data: ContactFormData
): ContactValidationErrors => {
  const errors: ContactValidationErrors = {};

  if (!data.name) {
    errors.name = 'Name is required.';
  } else if (!data.name.trim()) {
    errors.name = 'Name cannot start with space.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters long.';
  } else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = 'Name must contain at least one letter.';
  }

  if (!data.email) {
    errors.email = 'Email is required.';
  } else if (!data.email.trim()) {
    errors.email = 'Email cannot start with space.';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
  ) {
    errors.email = 'Invalid email address.';
  }

  if (!data.phone) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[0-9]{10}$/.test(data.phone)) {
    errors.phone = 'Phone must be exactly 10 digits.';
  }

  if (!data.subject) {
    errors.subject = 'Subject is required.';
  } else if (!data.subject.trim()) {
    errors.subject = 'Subject cannot start with space.';
  } else if (data.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters.';
  }

  if (!data.message) {
    errors.message = 'Message is required.';
  } else if (!data.message.trim()) {
    errors.message = 'Message cannot start with space.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
};