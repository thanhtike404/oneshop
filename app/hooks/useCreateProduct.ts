// @/app/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductSubmissionData } from '@/types/types'; // Ensure this path is correct
import { toast } from 'sonner';
import axios from 'axios';

export interface ProductCreateResponse {
  id: string;
  name: string;
  slug: string;
  // ... any other fields returned by your API on successful creation
}

async function createProduct(data: ProductSubmissionData): Promise<ProductCreateResponse> {
  const formData = new FormData();

  // 1. Basic product info
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  formData.append('description', data.description || '');
  formData.append('basePrice', data.basePrice.toString());
  formData.append('categoryId', data.categoryId);
  if (data.subcategoryId) {
    formData.append('subcategoryId', data.subcategoryId);
  }

  // 2. Variants and Stocks - Add debugging
  console.log('Original variants data:', data.variants);
  
  // Ensure variants is an array and has required properties
  const variantsWithStocks = Array.isArray(data.variants) ? data.variants.map(variant => ({
    name: variant.name,
    priceOffset: parseFloat(String(variant.priceOffset || 0)),
    stocks: Array.isArray(variant.stocks) ? variant.stocks.map(stock => ({
      quantity: parseInt(String(stock.quantity || 0)),
      location: stock.location || '',
      sku: stock.sku || null,
      barcode: stock.barcode || null
    })) : []
  })) : [];

  console.log('Processed variants data:', variantsWithStocks);
  formData.append('variantsData', JSON.stringify(variantsWithStocks)); // Changed key name to variantsData

  // 3. Handle images
  data.images.forEach(image => {
    if (image.file) {
      formData.append('imageFiles', image.file);
    }
  });

  // 4. Image metadata
  const imageMetadata = data.images.map(image => ({
    altText: image.altText || '',
    isPrimary: image.isPrimary
  }));
  formData.append('imageMetadata', JSON.stringify(imageMetadata));

  // Debug logging
  console.log('FormData entries:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
  }

  try {
    const response = await axios.post('/api/v1/dashboard/products', formData, {
      headers: {
        // Let axios set the content type
      },
      timeout: 60000,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      variants: variantsWithStocks
    });
    throw error;
  }
}
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation<ProductCreateResponse, Error, ProductSubmissionData>({ // Explicit types
    mutationFn: createProduct,
    onSuccess: (responseData) => { // 'responseData' instead of 'data' to avoid conflict
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Or a more specific query key
      toast.success("Product created successfully!", {
        description: `${responseData.name} has been added.`
      });
    },
    onError: (error: any) => {
      // Log the full error for better debugging
      console.error("Mutation onError:", error);

      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
      const validationErrors = error.response?.data?.errors;
      
      let description = errorMessage;
      if (validationErrors) {
        // Format validation errors nicely, e.g., "Name: required, Email: invalid"
        const errorDetails = Object.entries(validationErrors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
        description = `Validation failed: ${errorDetails}`;
        toast.error("Product creation failed", {
          description: description,
          duration: 5000, // Show for longer
        });
      } else {
        toast.error("Product creation failed", {
          description: description,
        });
      }
    }
  });
}