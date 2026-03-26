export interface GeneralSettingsFormData {
  siteName: string;
  email: string;
  phone: string;
  workingHours: string;
  siteDescription: string;
  address: string;
  currency: string; 
}

export interface SecuritySettingsFormData {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface MailConfigFormData {
  mailHost: string;
  mailPort: number;
  mailUsername: string;
  mailPassword: string;
  mailEncryption: string;
  mailFromAddress: string;
  mailFromName: string;
}

export interface LogoBrandingFormData {
  siteLogo?: File | null;
  adminLogo?: File | null;
  favicon?: File | null;
}

export interface GeneralSettingsErrors {
  siteName?: string;
  email?: string;
  phone?: string;
  workingHours?: string;
  siteDescription?: string;
  address?: string;
  currency?: string; 
}

export interface MailConfigErrors {
  mailHost?: string;
  mailPort?: string;
  mailUsername?: string;
  mailPassword?: string;
  mailEncryption?: string;
  mailFromAddress?: string;
  mailFromName?: string;
}

export interface LogoBrandingErrors {
  siteLogo?: string;
  adminLogo?: string;
  favicon?: string;
}

export const validateGeneralSettings = (data: GeneralSettingsFormData): GeneralSettingsErrors => {
  const errors: GeneralSettingsErrors = {};
  
  if (!data.siteName?.trim()) errors.siteName = 'Site name is required.';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email?.trim()) errors.email = 'Email is required.';
  else if (!emailRegex.test(data.email)) errors.email = 'Invalid email.';
  
  if (!data.phone?.trim()) errors.phone = 'Phone is required.';
  if (!data.siteDescription?.trim()) errors.siteDescription = 'Description is required.';
  if (!data.address?.trim()) errors.address = 'Address is required.';

  const currencyRegex = /^[$\u20AC\u00A3\u00A5\u20B9\u20BD\u20A9\u20AA\u20AB\u20AA]$/;
  
  if (!data.currency?.trim()) {
    errors.currency = 'Currency symbol is required.';
  } else if (!currencyRegex.test(data.currency.trim())) {
    errors.currency = 'Invalid currency symbol (e.g., $, €, ¥).';
  }

  return errors;
};

export const validateMailConfig = (data: MailConfigFormData): MailConfigErrors => {
  const errors: MailConfigErrors = {};
  if (!data.mailHost?.trim()) errors.mailHost = 'Host is required.';
  if (!data.mailPort || isNaN(Number(data.mailPort))) errors.mailPort = 'Valid port is required.';
  if (!data.mailUsername?.trim()) errors.mailUsername = 'Username is required.';
  if (!data.mailPassword?.trim()) errors.mailPassword = 'Password is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.mailFromAddress?.trim()) errors.mailFromAddress = 'From email is required.';
  else if (!emailRegex.test(data.mailFromAddress)) errors.mailFromAddress = 'Invalid email.';
  return errors;
};

export const validateSecuritySettings = (data: SecuritySettingsFormData) => {
  const errors: any = {};
  if (!data.currentPassword) errors.currentPassword = "Current password is required";
  if (!data.newPassword) {
    errors.newPassword = "New password is required";
  } else if (data.newPassword.length < 6) {
    errors.newPassword = "Password must be at least 6 characters";
  }
  if (data.confirmPassword !== data.newPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

export const validateLogoBranding = (
  files: LogoBrandingFormData, 
  existingPaths: { [key: string]: string }
): LogoBrandingErrors => {
  const errors: LogoBrandingErrors = {};
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/x-icon'];

  if (!files.siteLogo && !existingPaths.siteLogo) {
    errors.siteLogo = 'Site logo is required.';
  } else if (files.siteLogo && !validImageTypes.includes(files.siteLogo.type)) {
    errors.siteLogo = 'File must be an image (JPG, PNG, SVG).';
  }

  if (files.adminLogo && !validImageTypes.includes(files.adminLogo.type)) {
    errors.adminLogo = 'File must be an image.';
  }

  if (!files.favicon && !existingPaths.favicon) {
    errors.favicon = 'Favicon is required.';
  } else if (files.favicon && !validImageTypes.includes(files.favicon.type)) {
    errors.favicon = 'File must be an image or .ico.';
  }

  return errors;
};