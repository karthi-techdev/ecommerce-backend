import { z } from 'zod';

export interface Faq {
  _id?: string;
  question: string;
  answer: string;
  status?: 'active' | 'inactive';
}
export interface NewsLetter {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string | object;
  isPublished?: boolean;
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
export  interface Config{
  _id:string;
  name:string;
  slug:string;
  options:{key:string,value:string}[];
  status:'active'|'inactive';
}
export interface Slider{
  _id?:string;
  title:string;
  image: File |string| null;
  highlightsText:string;
  serialNumber:Number;
  buttonName:string;
  buttonUrl:string;
  status?:'active'|'inactive';
}
export interface MainCategory {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image:  File | string | null;
  isActive: boolean;
}

export interface Brand {
  _id?: string;           
  name: string;           
  slug: string;           
  description?: string;   
  image?: string;         
  isActive?: boolean;     
  isDeleted?: boolean;    
  createdAt?: string;     
  updatedAt?: string;
}


export interface Coupon {
  _id?: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;          
  mainCategoryId: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  mainCategory?: {_id: string; name: string;};
}
export interface ShipmentMethod {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  status?: 'active' | 'inactive';
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}



export interface PopulatedProduct {
  _id: string;
  name: string;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  sku?: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  brandId: PopulatedProduct;
  mainCategoryId: PopulatedProduct;
  subCategoryId: PopulatedProduct;
  categoryId: PopulatedProduct;
  status: 'active' | 'inactive';
  isDeleted?: boolean;
  images: string[];
  thumbnail?: string;
  colors?: string[];
  sizes?: string
  highlights?: string
  relatedTags?: string[]
}

export interface Page {
    _id?: string;
    name : string,
    slug : string,
    type? : "content" | "url",
    description? : string,
    url? : string,
    isActive? : boolean,
    createdAt? : Date
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}

export interface PageFormData {
  name: string;
  slug: string;
  description: string;
  type: "content" | "url";
  url?: string;
  isActive?: boolean;
}

export interface Testimonial {
  _id?: string;
  name: string;
  designation?: string;
  message?: string;
  image?: string;
  rating?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  slug?: string;
  description: string;
  images?: File[];   
  thumbnail?: File; 
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  brandId: string;
  mainCategoryId: string;
  subCategoryId: string;
  categoryId: string;
  status?: 'active' | 'inactive';
}

export interface Offer {
  _id?: string;
  name: string;
  banner: string;
  description?: string;
  buttonName: string;
  products: string[] | any[]; 
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface OfferProduct {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
}
export interface ProductFormData {
  name: string
  title: string
  shortDescription?: string
  longDescription?: string
  sku: string
  slug: string
  price: number | ""
  discountPrice: number | ""
  stockQuantity: number | ""
  brandId: string
  mainCategoryId: string
  subCategoryId: string
  categoryId: string
  images: (File | string)[]
  thumbnail: File | string | null
  colors: string[]
  sizes?: string
  highlights?: string
  relatedTags: string[]
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
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: any;
  onChange?: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
  dataTestId?: string;
  accept?: string;
  previewEnabled?: boolean;
  withEditor?: boolean;
  options? :{label:string , value:string , isDisabled? : boolean}[];
  multiple?: boolean;
  onMenuScrollToBottom?: () => void;
  onInputChange?: (value: string) => void;
  isMulti?: boolean;
 }

 export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface BlogFormData {
  name: string;
  slug: string;
  categoryId: string ;
  description: string; 
  isActive: boolean;
  coverImage?: string | File;
}

export interface Blog {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  categoryId: string | { _id: string; name: string };
  isActive: boolean;
  coverImage?: string | File;
}


export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};
export interface Promotions {
  _id?: string;
  name: string;
  image?: string;
  isActive: boolean;
}
