import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner"
import { Product } from '@/types/productType'
import {ProductSubmissionData} from '@/types/types'
import { FilterOptions } from '@/types/filterType'
import { useRouter } from 'next/navigation'
// Types for API responses
interface ProductCreateResponse {
  id: string
  name: string
  slug: string
}

// Fetch functions
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

const createProduct = async (data: ProductSubmissionData): Promise<ProductCreateResponse> => {
  const formData = new FormData()

  // 1. Basic product info
  formData.append('name', data.name)
  formData.append('slug', data.slug)
  formData.append('description', data.description || '')
  formData.append('basePrice', data.basePrice.toString())
  formData.append('categoryId', data.categoryId)
  if (data.subcategoryId) {
    formData.append('subcategoryId', data.subcategoryId)
  }

  // 2. Variants and Stocks
  const variantsWithStocks = Array.isArray(data.variants) ? data.variants.map(variant => ({
    name: variant.name,
    priceOffset: parseFloat(String(variant.priceOffset || 0)),
    stocks: Array.isArray(variant.stocks) ? variant.stocks.map(stock => ({
      quantity: parseInt(String(stock.quantity || 0)),
      location: stock.location || '',
      sku: stock.sku || null,
      barcode: stock.barcode || null
    })) : []
  })) : []

  formData.append('variantsData', JSON.stringify(variantsWithStocks))

  // 3. Handle images
  data.images.forEach(image => {
    if (image.file) {
      formData.append('imageFiles', image.file)
    }
  })

  // 4. Image metadata
  const imageMetadata = data.images.map(image => ({
    altText: image.altText || '',
    isPrimary: image.isPrimary
  }))
  formData.append('imageMetadata', JSON.stringify(imageMetadata))

  const response = await axios.post('/api/v1/dashboard/products', formData, {
    timeout: 60000,
  })
  return response.data
}

const deleteProduct = async (productId: string) => {
  const url = `/api/v1/dashboard/products/${productId}`
  const res = await axios.delete(url)
  return res.data
}

// Query hooks
export const useProducts = (filters?: FilterOptions) => {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const route=useRouter()
  return useMutation<ProductCreateResponse, Error, ProductSubmissionData>({
    mutationFn: createProduct,
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      route.push(`/dashboard/product`)
      toast.success("Product created successfully!")
    },
    onError: (error: any) => {
      console.error("Mutation onError:", error)
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred."
      const validationErrors = error.response?.data?.errors
      
      let description = errorMessage
      if (validationErrors) {
        const errorDetails = Object.entries(validationErrors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ')
        description = `Validation failed: ${errorDetails}`
        toast.error("Product creation failed", {
          description: description,
          duration: 5000,
        })
      } else {
        toast.error("Product creation failed")
      }
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Product deleted successfully!")
    }
  })
}

export const useDeleteManyProducts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productIds: string[]) => {
      const response = await axios.delete('/api/v1/dashboard/products', {
        data: { productIds },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Products deleted successfully!")
    }
  })
}