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

// @/types/types.ts

// ... other types ...



export interface VariantStock {

  id?: string; // Optional if new
  size?: string;
  quantity: number;
}

export interface Variant {
  id?: string; // Optional if new
  name: string;
  priceOffset: number;
  sku?: string;
  stocks: VariantStock[];
}

// From your form
export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  basePrice: number; // This was string in some contexts, ensure consistency
  categoryId: string;
  subcategoryId?: string;
}

export interface StockInput {
  quantity: number;
  location?: string;
  sku?: string | null;
  barcode?: string | null;
}
export interface ProductVariantInput {
  name: string;
  priceOffset: number;
  stocks: StockInput[];
}
export interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: string;
  subcategoryId?: string;
}

// For submission, including files
export interface ProductSubmissionImage {
  file?: File; // The actual File object
  // url: string; // The blob URL is not strictly needed for submission, but can be kept for reference
  altText: string;
  isPrimary: boolean;
}
export interface ProductImage {
  file?: File;        // Optional file for new uploads
  url?: string;       // Optional URL for existing images
  altText: string;
  isPrimary: boolean;
  // You might want to add an id field if you're editing existing images
  id?: string;        // Optional ID for existing images
}

export interface ProductSubmissionData {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: string;
  subcategoryId?: string;
  variants: {
    name: string;
    priceOffset: number;
    stocks: {
      quantity: number;
      location?: string;
      sku?: string | null;
      barcode?: string | null;
    }[];
  }[];
images: ProductImage[];
}