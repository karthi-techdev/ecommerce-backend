import { z } from 'zod';

export interface Faq {
  _id?: string;
  question: string;
  answer: string;
  status?: 'active' | 'inactive';
}
export interface PopulatedCategory{
  _id:string;
  name:string;
}
export interface Category{
  _id?:string;
  name:string;
  slug:string;
  description:string;
  image:string;
  mainCategoryId:PopulatedCategory;
  subCategoryId:PopulatedCategory;
  status:'active'|'inactive';
}
export interface mainCategory{
  _id:string;
  name:string;
  slug:string;
  description:string;
  image:string;
}
export interface subCategory{
  _id:string;
  name:string;
  slug:string;
  description:string;
  image:string;
  mainCategoryId:string;
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

  export interface SelectOption {
  label: string;
  value: string;
}
export interface FieldConfig {
  name: string;
  label: string;
  type: InputType;
  required?: boolean;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  validation?: z.ZodSchema<any>;
  options?:SelectOption[];
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: any;
  onChange?: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
  dataTestId?: string;
}

export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};