'use client'

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useCategories } from '@/app/hooks/useCategories';
import { useFilteredSubcategories } from '@/app/hooks/useFileredSubCategories';
import { ProductFormData } from '@/types/types';

interface BasicInformationProps {
  form: UseFormReturn<ProductFormData>;
}

export default function BasicInformation({ form }: BasicInformationProps) {
  const watchCategoryId = form.watch("categoryId");

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { 
    filteredSubcategories,
    isLoading: isSubcategoriesLoading 
  } = useFilteredSubcategories(watchCategoryId);

  // Reset subcategory when category changes and current subcategory doesn't match new category
  useEffect(() => {
    const currentSubcategoryId = form.getValues("subcategoryId");
    const isValid = filteredSubcategories.some(sub => sub.id === currentSubcategoryId);

    if (!isValid) {
      form.setValue("subcategoryId", "");
    }
  }, [watchCategoryId, filteredSubcategories, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the basic details of your product
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="product-url-slug" {...field} />
                </FormControl>
                <FormDescription>
                  Used for the product URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description..." 
                  className="min-h-32" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Price */}
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category<span className="text-red-500">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isCategoriesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subcategory */}
          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={
                    !watchCategoryId ||
                    isSubcategoriesLoading ||
                    filteredSubcategories.length === 0
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubcategories.map(subcategory => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
