import { useState } from 'react';
import { ProductImage } from '@/types/types'
import { toast } from 'sonner';

export function useProductImages() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // In a real app, you would upload to your server or a service like S3 here
      // This is a simulated upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newImages = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file, // Store the file object for later actual upload
        altText: file.name,
        isPrimary: images.length === 0, // First image is primary by default
      }));
      
      setImages([...images, ...newImages]);
      // toast({
      //   title: "Success",
      //   description: `${files.length} image(s) added successfully.`,
      // });
    } catch (error) {
      console.error('Error uploading images:', error);
      // toast({
      //   title: "Error",
      //   description: "Failed to upload images. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    
    // If we're removing the primary image, make the next one primary (if any)
    const wasRemovingPrimary = newImages[index].isPrimary;
    newImages.splice(index, 1);
    
    if (wasRemovingPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    setImages(newImages);
  };

  const setAsPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setImages(newImages);
  };

  const updateImageAltText = (index: number, altText: string) => {
    const newImages = [...images];
    newImages[index].altText = altText;
    setImages(newImages);
  };

  const resetImages = () => {
    setImages([])
  }
  return {
    images,
    isUploading,
    handleImageUpload,
    removeImage,
    setAsPrimary,
    updateImageAltText,
    setImages,
    resetImages
  };
}