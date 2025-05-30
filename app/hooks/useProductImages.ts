// @/app/hooks/useProductImages.ts
import { useState, useCallback } from 'react';
import { ProductImage } from '@/types/types'; // Ensure this path is correct
import { toast } from 'sonner';

const MAX_IMAGES = 5; // Example limit
const MAX_FILE_SIZE_MB = 5; // Example limit
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function useProductImages() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false); // For visual feedback if actual upload happens here

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true); // Simulating upload start, actual upload is on form submit

    const newImages: ProductImage[] = [];
    let currentImageCount = images.length;

    for (let i = 0; i < files.length; i++) {
      if (currentImageCount + newImages.length >= MAX_IMAGES) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
        break;
      }

      const file = files[i];

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`File ${file.name} is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not a valid image type.`);
        continue;
      }
      
      const imageUrl = URL.createObjectURL(file);
      newImages.push({
        file: file, // Store the actual file
        url: imageUrl, // For preview
        altText: '',
        isPrimary: images.length === 0 && newImages.length === 0, // First ever image is primary
      });
    }

    setImages(prevImages => {
      const combined = [...prevImages, ...newImages];
      // Ensure only one primary image, defaulting to the first if multiple were somehow set
      let primaryFound = false;
      return combined.map((img, idx) => {
        if (img.isPrimary && !primaryFound) {
          primaryFound = true;
          return img;
        }
        if (img.isPrimary && primaryFound) {
          return { ...img, isPrimary: false };
        }
        // If no primary was found after iterating and this is the first image, make it primary
        if (!primaryFound && idx === 0 && combined.length > 0) {
            primaryFound = true; // technically already true because we'd break
            return { ...img, isPrimary: true };
        }
        return img;
      });
    });

    setIsUploading(false);
    e.target.value = ''; // Reset file input
  }, [images]);

  const removeImage = useCallback((index: number) => {
    setImages(prevImages => {
      const imageToRemove = prevImages[index];
      if (imageToRemove && imageToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url); // Revoke blob URL
      }
      const updatedImages = prevImages.filter((_, i) => i !== index);
      // If the removed image was primary, and there are other images, make the new first one primary
      if (imageToRemove?.isPrimary && updatedImages.length > 0) {
        updatedImages[0] = { ...updatedImages[0], isPrimary: true };
      }
      return updatedImages;
    });
  }, []);

  const setAsPrimary = useCallback((index: number) => {
    setImages(prevImages =>
      prevImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  }, []);

  const updateImageAltText = useCallback((index: number, altText: string) => {
    setImages(prevImages =>
      prevImages.map((img, i) =>
        i === index ? { ...img, altText } : img
      )
    );
  }, []);

  const resetImages = useCallback(() => {
    images.forEach(image => {
      if (image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
    });
    setImages([]);
  }, [images]);

  return {
    images,
    isUploading,
    handleImageUpload,
    removeImage,
    setAsPrimary,
    updateImageAltText,
    resetImages,
  };
}