import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  subcategories: Subcategory[]
  products: Product[]
  createdAt: string
  updatedAt: string
}

interface Subcategory {
  id: string
  name: string
  slug: string
  description?: string
  iconUrl?: string
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
  slug: string
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get('/api/v1/categories')
  return response.data
}

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}
