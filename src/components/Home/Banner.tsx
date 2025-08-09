'use client';

import React, { useEffect, useState, useRef } from 'react';

const banners = [
  {
    id: 1,
    imageUrl: 'https://cdn.pixabay.com/photo/2022/09/28/04/37/market-7484192_1280.jpg',
    alt: 'E-Commerce ',
  },
  {
    id: 2,
    imageUrl: 'https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_1280.jpg',
    alt: 'cart',
  },
  {
    id: 3,
    imageUrl: 'https://cdn.pixabay.com/photo/2017/06/18/14/01/shopping-2415820_1280.jpg',
    alt: 'buy',
  },
  {
    id: 4,
    imageUrl: 'https://cdn.pixabay.com/photo/2019/12/14/08/36/shopping-4694470_1280.jpg',
    alt: 'online',
  },

];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear existing timeout
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
    }, 4000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-8xl mb-12 mx-auto overflow-hidden rounded-lg shadow-lg">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        {banners.map((banner, index) => (
          <img
            key={banner.id}
            src={banner.imageUrl}
            alt={banner.alt}
            className={`
              absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000
              ${index === currentIndex ? 'opacity-100 z-20' : 'opacity-0 z-10'}
            `}
            loading="lazy"
          />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`
              w-4 h-4 rounded-full
              ${idx === currentIndex ? 'bg-amber-500' : 'bg-gray-300 hover:bg-gray-400'}
              transition-colors duration-300
            `}
            aria-label={`Show banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
