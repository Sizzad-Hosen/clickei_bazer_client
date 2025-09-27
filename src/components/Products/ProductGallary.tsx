'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

interface ProductGalleryProps {
  images: string[];
  title?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative w-full h-88">
        <Image
          src={images[currentIndex]}
          alt={title || `Image ${currentIndex + 1}`}
          fill
          className="object-cover rounded"
        />

        {/* Left Arrow */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition"
        >
          <MdArrowBackIos size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition"
        >
          <MdArrowForwardIos size={20} />
        </button>
      </div>

      {/* Title below image */}
      {title && (
        <p className="text-center mt-2 font-medium text-gray-800">
          {title}
        </p>
      )}

      {/* Image Indicator */}
      <p className="text-center text-sm text-gray-500 mt-1">
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  );
};

export default ProductGallery;
