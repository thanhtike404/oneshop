import { useQuery } from '@tanstack/react-query';
import { Subcategory } from '@/types/types';

async function fetchSubcategories(): Promise<Subcategory[]> {
  const response = await fetch('/api/v1/subcategories');
  if (!response.ok) {
    throw new Error('Failed to fetch subcategories');
  }
  const data = await response.json();
  return data.subcategories || [];
}

export function useSubcategories() {
  return useQuery<Subcategory[], Error>({
    queryKey: ['subcategories'],
    queryFn: fetchSubcategories,
  });
}