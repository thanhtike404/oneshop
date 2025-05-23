import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ProductResponse } from '@/types/productType'

const fetchProduct = async (productId: string): Promise<ProductResponse> => {
  const response = await axios.get(`/api/v1/products/${productId}`)
  return response.data
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  })
}