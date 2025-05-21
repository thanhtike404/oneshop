// lib/validation.ts
import * as z from 'zod';

// Stock entry validation schema
export const stockEntrySchema = z.object({
  quantity: z.number().int().min(0, "Quantity must be a positive number"),
  location: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
});

// Variant validation schema
export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  priceOffset: z.number(),
  stocks: z.array(stockEntrySchema).min(1, "At least one stock entry is required"),
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().min(0, "Base price must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string(),
});

// Product image validation schema
export const productImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  altText: z.string().optional(),
  isPrimary: z.boolean(),
});

// Type inference helpers
export type StockEntryData = z.infer<typeof stockEntrySchema>;
export type VariantData = z.infer<typeof variantSchema>;
export type ProductData = z.infer<typeof productSchema>;
export type ProductImageData = z.infer<typeof productImageSchema>;