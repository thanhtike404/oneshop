import { useMemo } from 'react';
import { useSubcategories } from './useSubCategories';
import { Subcategory } from '@/types/types';

export function useFilteredSubcategories(categoryId: string | null): {
  filteredSubcategories: Subcategory[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data: subcategories, isLoading, error } = useSubcategories();
  
  const filteredSubcategories = useMemo(() => {
    if (!subcategories || !categoryId) return [];
    return subcategories.filter(sub => sub.categoryId === categoryId);
  }, [subcategories, categoryId]);

  return {
    filteredSubcategories,
    isLoading,
    error: error || null,
  };
}