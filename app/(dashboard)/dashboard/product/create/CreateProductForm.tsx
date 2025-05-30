// CreateProductForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { productSchema, variantSchema } from '@/lib/validation' // Ensure these paths are correct
import { ProductFormData, ProductSubmissionData, ProductImage as ProductImageType } from '@/types/types' // Ensure paths and add ProductImage

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import BasicInformation from './BasicInformation'
import ProductImages from './ProductImages' // This component receives images: ProductImageType[]
import ProductVariants from './ProductVariants'

import { useSlugGeneration } from '@/app/hooks/useSlugGeneration'
import { useProductImages } from '@/app/hooks/useProductImages' // Correct path
import { useProductVariants } from '@/app/hooks/useProductVariants' // Correct path
import { useCreateProduct } from '@/app/hooks/useCreateProduct' // Correct path
import { toast } from 'sonner'
import { useState } from 'react'

export default function CreateProductForm() {
  const [variantError, setVariantError] = useState(false)
  const [imageError, setImageError] = useState(false)

  const form = useForm<ProductFormData>({
    // resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      basePrice: 0,
      categoryId: '',
      subcategoryId: '',
    },
  })

  useSlugGeneration(form)

  const {
    images, // This is now ProductImageType[] from our hook
    isUploading,
    handleImageUpload,
    removeImage,
    setAsPrimary,
    updateImageAltText,
    resetImages
  } = useProductImages()

  const {
    variants,
    addVariant,
    removeVariant,
    updateVariant,
    updateStock,
    addStock,
    removeStock
  } = useProductVariants()

  const createProductMutation = useCreateProduct()
  

  const onSubmit = async (data: ProductFormData) => {
    setVariantError(false)
    setImageError(false)

    // Validate variants
    try {
      variants.forEach((variant) => { // Removed idx as it's not used
        variantSchema.parse(variant)
      })
    } catch (error) {
      setVariantError(true)
      toast.error('One or more variants are invalid. Please check variant names and stock details.')
      console.error("Variant validation error:", error);
      return
    }

    // Validate images
    if (images.length === 0) {
      setImageError(true)
      toast.error('Please upload at least one product image.')
      return
    }
    if (!images.some(img => img.isPrimary)) {
      setImageError(true);
      toast.error('Please select one image as primary.');
      return;
    }

// @ts-ignore
    const productData: ProductSubmissionData = {
      ...data,
      basePrice: Number(data.basePrice), // Ensure basePrice is a number
      variants: variants.map(v => ({
        ...v,
        priceOffset: Number(v.priceOffset) || 0,
        stocks: v.stocks.map(s => ({ ...s, quantity: Number(s.quantity) || 0 }))
      })),
      images: images.map(img => ({
        file: img.file, // Pass the File object
        url: img.url, // Can be omitted for submission if backend only needs the file
        altText: img.altText || '',
        isPrimary: img.isPrimary
      }))
    }
    
    console.log('Submitting productData:', productData);


    try {
      await createProductMutation.mutateAsync(productData)
      // toast.success('Product created successfully!') // Handled by useCreateProduct's onSuccess
      // alert('created fuckng successfully') // Replaced by toast
      resetImages()
      // TODO: reset variants state if useProductVariants hook exposes a reset function
      form.reset({ // Reset form with default values
        name: '',
        slug: '',
        description: '',
        basePrice: 0,
        categoryId: '',
        subcategoryId: '',
      }) 
    } catch (error) {
      // Error handling is now more centralized in useCreateProduct's onError
      // but you can still have specific logic here if needed.
      console.error('🚨 Error during product submission in form:', error)
      // toast.error('Failed to create product') // This might be redundant if useCreateProduct handles it
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create New Product</h1>
      <p className="text-gray-500 mb-6">Add a new product to your inventory</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BasicInformation form={form} />

          <ProductImages
            images={images}
            isUploading={isUploading} // This is the visual spinner state
            onUpload={handleImageUpload}
            onRemove={removeImage}
            onSetPrimary={setAsPrimary}
            onUpdateAltText={updateImageAltText}
          />
          {imageError && (
            <p className="text-sm text-red-500 -mt-6">Please ensure at least one image is uploaded and one is set as primary.</p>
          )}

          <ProductVariants
            variants={variants}
            onAddVariant={addVariant}
            onRemoveVariant={removeVariant}
            onUpdateVariant={updateVariant}
            onAddStock={addStock}
            onRemoveStock={removeStock}
            onUpdateStock={updateStock}
          />
          {variantError && (
            <p className="text-sm text-red-500 -mt-6">One or more variants are invalid. Please check names, price offsets, and stock details.</p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={createProductMutation.isPending || isUploading} // Disable if form is submitting or images are "processing"
            >
              {createProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}