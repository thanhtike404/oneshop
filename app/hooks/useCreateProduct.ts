import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductSubmissionData } from '@/types/types';
import { toast } from 'sonner';
import axios from 'axios';

export interface ProductCreateResponse {
  id: string;
  name: string;
  slug: string;
  // Add other fields you expect to receive
}

async function createProduct(data: ProductSubmissionData): Promise<ProductCreateResponse> {
  try {
    // For debugging
    console.log("Submitting product data:", JSON.stringify(data));
    
    // Create a deep copy of the data to avoid modifying the original
    const productData = JSON.parse(JSON.stringify(data));
    
    // Handle empty subcategoryId properly
    if (!productData.subcategoryId || productData.subcategoryId.trim() === "") {
      productData.subcategoryId = null;
    }
    
    // Ensure numeric values are properly formatted
    productData.basePrice = parseFloat(String(productData.basePrice));
    productData.variants = productData.variants.map((variant: any) => ({
      ...variant,
      priceOffset: parseFloat(String(variant.priceOffset)),
      stocks: variant.stocks.map((stock: any) => ({
        ...stock,
        quantity: parseInt(String(stock.quantity))
      }))
    }));
    
    // Make the API call
    const response = await axios.post('/api/v1/dashboard/products', productData);
    
    // For debugging
    console.log("Product created successfully:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Re-throw the error to be handled by the onError callback
    throw error;
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast.success("Product created successfully", {
        description: `${data.name} has been added to your catalog.`
      });
      
      return data;
    },
    onError: (error: any) => {
      console.error('Error creating product:', error);
      
      // Extract error message for a better user experience
      const errorMessage = error.response?.data?.message || 
                         "Failed to create product. Please try again.";
      
      toast.error("Error creating product", {
        description: errorMessage
      });
    }
  });
}