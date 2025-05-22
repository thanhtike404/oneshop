import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  categoryId: string;
}

interface CreateSubcategoryDTO {
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  categoryId: string;
}

export const useSubcategories = () => {
  const queryClient = useQueryClient();

  const { data: subcategories, isLoading } = useQuery<Subcategory[]>({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/subcategories');
      return response.data.subcategories;
    },
  });

  const createSubcategory = useMutation({
    mutationFn: (data: CreateSubcategoryDTO) =>
      axios.post('/api/v1/subcategories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    },
  });

  return {
    subcategories,
    isLoading,
    createSubcategory,
  };
};