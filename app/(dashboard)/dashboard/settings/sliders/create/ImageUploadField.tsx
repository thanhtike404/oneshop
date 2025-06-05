import React from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';

interface ImageUploadFieldProps {
  previewImage: string | null;
  clearImageSelection: () => void;
  register: any;
  errors: any;
}

export const ImageUploadField = ({
  previewImage,
  clearImageSelection,
  register,
  errors
}: ImageUploadFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Slider Image
    </label>

    <div
      className={`border-2 border-dashed rounded-lg p-8 transition-colors 
        border-gray-300 hover:border-gray-400 
        dark:border-gray-600 dark:hover:border-gray-500
        ${errors.image ? 'border-red-500' : ''}`}
    >
      {previewImage ? (
        <div className="relative">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={clearImageSelection}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700">
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
              </span>
              <input
                {...register('image')}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
              />
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, WebP up to 10MB
          </p>
        </div>
      )}
    </div>

    {errors.image && (
      <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
    )}
  </div>
);
