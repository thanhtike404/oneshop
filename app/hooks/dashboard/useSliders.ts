import axios from "axios";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { SliderFormData } from "@/utils/sliders/validation";
export const useCreateSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      axios.post('/api/v1/dashboard/settings/sliders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sliders'] });
      alert('success');
    },
    onError: () => {
      alert('error');
    },
  });
};
