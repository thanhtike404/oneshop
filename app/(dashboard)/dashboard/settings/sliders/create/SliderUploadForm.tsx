'use client';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { SliderFormData } from '@/utils/sliders/validation';
import { sliderSchema } from '@/utils/sliders/validation';
import { ImageUploadField } from './ImageUploadField';
import { SliderCard } from './SliderCard';
import { Sliders as Slider } from '@/prisma/generated';
import { useCreateSlider } from '@/app/hooks/dashboard/useSliders';

const SliderUploadForm = () => {
  const [uploadedSliders, setUploadedSliders] = useState<Slider[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { mutateAsync: createSlider, isPending } = useCreateSlider();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(sliderSchema)
  });

  const watchedImage = watch('image');

  React.useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  }, [watchedImage]);

  const removeSlider = (id: string) => {
    setUploadedSliders(prev => prev.filter(slider => slider.id !== id));
  };

  const clearImageSelection = () => {
    setValue('image', null);
    setPreviewImage(null);
  };

  const onSubmit = async (data: SliderFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('image', data.image[0]);

      await createSlider(formData);

      reset();
      setPreviewImage(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Slider Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Upload and manage your slider images
            </p>
          </div>
        </div>

        <div className="rounded-xl p-6 mb-8 shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Plus size={20} />
            Add New Slider
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Slider Title
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="Enter slider title..."
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <ImageUploadField
              previewImage={previewImage}
              clearImageSelection={clearImageSelection}
              register={register}
              errors={errors}
            />

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 rounded-lg font-medium transition-all text-white shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload Slider'
              )}
            </button>
          </form>
        </div>

        {uploadedSliders.length > 0 && (
          <div className="rounded-xl p-6 shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Uploaded Sliders ({uploadedSliders.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedSliders.map((slider) => (
                <SliderCard
                  key={slider.id}
                  slider={slider}
                  onRemove={removeSlider}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderUploadForm;
