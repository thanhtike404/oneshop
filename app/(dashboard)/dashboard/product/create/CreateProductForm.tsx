'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { productSchema, variantSchema } from '@/lib/validation'
import { ProductFormData, ProductSubmissionData } from '@/types/types'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import BasicInformation from './BasicInformation'
import ProductImages from './ProductImages'
import ProductVariants from './ProductVariants'

import { useSlugGeneration } from '@/app/hooks/useSlugGeneration'
import { useProductImages } from '@/app/hooks/useProductImages'
import { useProductVariants } from '@/app/hooks/useProductVariants'
import { useCreateProduct } from '@/app/hooks/useCreateProduct'
import { toast } from 'sonner'
import { useState } from 'react'

export default function CreateProductForm() {
  const [variantError, setVariantError] = useState(false)
  const [imageError, setImageError] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
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
    images,
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

    try {
      // Validate variants
      try {
        variants.forEach((variant, idx) => {
          variantSchema.parse(variant)
        })
      } catch (error) {
        setVariantError(true)
        toast.error('One or more variants are invalid.')
        return
      }

      // Validate images
      if (images.length === 0) {
        setImageError(true)
        toast.error('Please upload at least one product image.')
        return
      }

      const productData: ProductSubmissionData = {
        ...data,
        variants: variants,
        images: images.map(img => ({
          url: img.url,
          altText: img.altText || '',
          isPrimary: img.isPrimary
        }))
      }

      await createProductMutation.mutateAsync(productData)
      // console.log(productData,'productData')
      // toast.success('Product created successfully!')
      alert('created fuckng successfully')
      resetImages()
      form.reset()
    } catch (error) {
      console.error('🚨 Error creating product:', error)
      toast.error('Failed to create product')
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
            isUploading={isUploading}
            onUpload={handleImageUpload}
            onRemove={removeImage}
            onSetPrimary={setAsPrimary}
            onUpdateAltText={updateImageAltText}
          />
          {imageError && (
            <p className="text-sm text-red-500 -mt-6">Please upload at least one product image.</p>
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
            <p className="text-sm text-red-500 -mt-6">One or more variants are invalid.</p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={createProductMutation.isPending}
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
