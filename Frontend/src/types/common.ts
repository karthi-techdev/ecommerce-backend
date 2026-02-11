import { z } from 'zod';

export interface Faq {
  _id?: string;
  question: string;
  answer: string;
  status?: 'active' | 'inactive';
}
export interface MainCategory {
  _id?: string;
  mainCategoryId?: string;
  name: string;
  slug: string;
  description: string;
  image:  File | string | null;
  isActive: boolean;
}


export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'radio'
  | 'password'
  | 'country-select'
  | 'state-select'
  | 'city-select'
  | 'composite'
  | 'array';

export interface FieldConfig {
  name: string;
  label: string;
  type: InputType;
  required?: boolean;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  validation?: z.ZodSchema<any>;
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: any;
  onChange?: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
 }

export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};