"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

const banners = [
  {
    id: 1,
    imageUrl: "https://cdn.pixabay.com/photo/2022/09/28/04/37/market-7484192_1280.jpg",
    alt: "E-Commerce",
  },
  {
    id: 2,
    imageUrl: "https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_1280.jpg",
    alt: "Cart",
  },
  {
    id: 3,
    imageUrl: "https://cdn.pixabay.com/photo/2017/06/18/14/01/shopping-2415820_1280.jpg",
    alt: "Buy",
  },
  {
    id: 4,
    imageUrl: "https://cdn.pixabay.com/photo/2019/12/14/08/36/shopping-4694470_1280.jpg",
    alt: "Online",
  },
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => resetTimeout();
  }, [currentIndex]);

  return (
    <section aria-label="Featured offers" className="relative mx-auto mb-8 w-full max-w-7xl overflow-hidden rounded-lg shadow-lg sm:mb-12">
      <div className="relative aspect-[16/9] w-full sm:aspect-[16/7]">
        <Image
          key={banners[currentIndex].id}
          src={banners[currentIndex].imageUrl}
          alt={banners[currentIndex].alt}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) calc(100vw - 1.5rem), 1280px"
          priority={currentIndex === 0}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${
              idx === currentIndex ? "bg-amber-500" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Show banner ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
