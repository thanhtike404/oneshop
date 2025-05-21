// lib/types.ts
export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface StockEntry {
  quantity: number;
  location: string;
  sku: string;
  barcode: string;
}

export interface ProductVariant {
  name: string;
  priceOffset: number;
  stocks: StockEntry[];
}

export interface ProductImage {
  url: string;
  file?: File;
  altText: string;
  isPrimary: boolean;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: string;
  subcategoryId: string;
}

export interface ProductSubmissionData extends ProductFormData {
  variants: ProductVariant[];
  images: Omit<ProductImage, 'file'>[];
}