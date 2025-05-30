import axios from 'axios'
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner"
import { Product } from '@/types/productType'

import { FilterOptions } from '@/types/filterType'
const fetchProducts = async (filters: FilterOptions = {}) => {interface FilterOptions {
  name?: string
  categoryId?: string
  subcategoryId?: string
}
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

 const deleteProduct = async (productId: string) => {
  const url = `/api/v1/dashboard/products/${productId}`
  const res = await axios.delete(url)
  return res.data
}

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
  })
}

export const useDeleteManyProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productIds: string[]) => {
      const response = await axios.delete('/api/v1/dashboard/products', {
        data: { productIds },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success("Products deleted successfully!");
    }
  });
};
