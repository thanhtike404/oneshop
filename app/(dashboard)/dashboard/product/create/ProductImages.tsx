'use client'

import { X, Upload, Loader2 } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ProductImage } from '@/types/types';

interface ProductImagesProps {
  images: ProductImage[];
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onSetPrimary: (index: number) => void;
  onUpdateAltText: (index: number, altText: string) => void;
}

export default function ProductImages({
  images,
  isUploading,
  onUpload,
  onRemove,
  onSetPrimary,
  onUpdateAltText
}: ProductImagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Upload images of your product (the first image will be used as the primary image)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative border rounded-md overflow-hidden">
              <img 
                src={image.url} 
                alt={image.altText || "Product image"} 
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  type="button" 
                  size="icon" 
                  variant="destructive" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2 bg-white flex items-center justify-between">
                <Input
                  placeholder="Alt text"
                  value={image.altText || ""}
                  onChange={(e) => onUpdateAltText(index, e.target.value)}
                  className="text-xs h-8"
                />
                <div className="flex items-center ml-2">
                  <input 
                    type="radio" 
                    id={`primary-${index}`} 
                    name="primary-image" 
                    checked={image.isPrimary} 
                    onChange={() => onSetPrimary(index)}
                    className="mr-1"
                  />
                  <label htmlFor={`primary-${index}`} className="text-xs">Primary</label>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border border-dashed rounded-md flex items-center justify-center h-40">
            <div className="text-center p-4">
              <label htmlFor="image-upload" className="cursor-pointer">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload Images</span>
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={onUpload}
                disabled={isUploading}
              />
            </div>
          </div>
        </div>
        
        {images.length === 0 && (
          <Alert className="mb-4">
            <AlertTitle>No images added</AlertTitle>
            <AlertDescription>
              Please add at least one product image.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}