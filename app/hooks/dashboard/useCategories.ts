import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios';


  async function getCategories() {
    try {
      const response = await axios.get("/api/v1/dashboard/categories");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  }


interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

interface CreateSubcategoryDTO {
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  categoryId: string;
}

export function useCategories() {
  const queryClient = useQueryClient();
  
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createCategory = useMutation({
    mutationFn: (data: CreateCategoryDTO) => 
      axios.post('/api/v1/dashboard/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const createSubcategory = useMutation({
    mutationFn: (data: CreateSubcategoryDTO) => 
      axios.post('/api/v1/dashboard/subcategories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories,
    isLoading,
    error,
    createCategory,
    createSubcategory,
  };
}