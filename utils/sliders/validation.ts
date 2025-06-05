import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from './constants';

export const sliderSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  image: z.any()
    .refine((file) => file?.length > 0, 'Image is required')
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, 'Max image size is 10MB')
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type), 
      'Only .jpg, .jpeg, .png and .webp formats are supported')
});

export type SliderFormData = z.infer<typeof sliderSchema>;