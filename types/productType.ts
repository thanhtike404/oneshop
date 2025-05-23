import { ProductImage } from "@/prisma/generated"
import { Stock as ProductStock } from "@/prisma/generated"
// types/productType.ts
export type Product = {
  id: string
  name: string
  images: {
    url: string
    altText: string | null
    isPrimary: boolean
  }[]
  totalStock: number
  stockCount: number
  stocks: {
    quantity: number
    sku: string
    barcode: string
    location: string
    size: string  // Add this
    variant: {
      name: string
    }
  }[]
  category?: {
    id: string
    name: string
  }
  subcategory?: {
    id: string
    name: string
  } | null
}

// types/productType.ts
export interface ProductResponse {
  id: string
  name: string
  images: {
    id: string
    createdAt: Date
    url: string
    altText: string | null
    isPrimary: boolean
    productId: string
  }[]
  totalStock: number
  stockCount: number
  stocks: {
    id: string
    quantity: number
    sku: string
    barcode: string
    location: string
    variant: {
      name: string
    }
  }[]
  category?: {
    id: string
    name: string
  }
  subcategory?: {
    id: string
    name: string
  } | null // Allow null
}