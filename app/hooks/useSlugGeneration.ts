import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormData } from '@/types/types';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

export function useSlugGeneration(form: UseFormReturn<ProductFormData>) {
  const watchName = form.watch("name");

  useEffect(() => {
    if (watchName) {
      const slug = generateSlug(watchName);
      form.setValue("slug", slug);
    }
  }, [watchName, form]);
}