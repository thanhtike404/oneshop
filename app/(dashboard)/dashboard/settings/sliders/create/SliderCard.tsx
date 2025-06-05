import Image from 'next/image';
import { Trash2 } from 'lucide-react';

interface SliderCardProps {
  slider: {
    id: string;
    title: string;
    image: string;
  };

  onRemove: (id: string) => void;
}

export const SliderCard = ({ slider,  onRemove }: SliderCardProps) => (
  <div
    className={`group relative rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02`}
  >
    <Image
      height={200}
      width={200}
      src={slider.image}
      alt={slider.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className={`font-medium ${
        slider.title.length > 20
          ? 'text-sm'
          : 'text-lg'
      }`}>
        {slider.title}
      </h3>
    </div>
    <button
      onClick={() => onRemove(slider.id)}
      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
    >
      <Trash2 size={16} />
    </button>
  </div>
);