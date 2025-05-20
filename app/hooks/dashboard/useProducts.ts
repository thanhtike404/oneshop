import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export type Product = {
  id: string
  name: string
  images: {
    url: string
    altText: string
    isPrimary: boolean
  }[]
  totalStock: number
  stockCount: number
  stocks: {
    quantity: number
    sku: string
    barcode: string
    location: string
    variant: {
      name: string
    }
  }[]
}

interface FilterOptions {
  name?: string
  categoryId?: string
  subcategoryId?: string
}

const fetchProducts = async (filters: FilterOptions = {}) => {
  const { name, categoryId, subcategoryId } = filters
  const queryParams = new URLSearchParams()

  if (name) queryParams.append('name', name)
  if (categoryId) queryParams.append('categoryId', categoryId)
  if (subcategoryId) queryParams.append('subcategoryId', subcategoryId)

  const url = `/api/v1/dashboard/products?${queryParams.toString()}`
  const res = await axios.get(url)
  return res.data as Product[]
}

export const useProducts = (filters?: FilterOptions) => {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000,
  })
}
