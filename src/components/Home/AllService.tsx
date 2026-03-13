"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useGetAllServicesQuery, useLazyServiceHomeFullTreeQuery } from "@/redux/features/Services/serviceApi";
import Spinner from "../Spinner";
import { Service } from "@/types/products";


import food from "../../../public/food.webp";
import fruit from "../../../public/fruit.webp";
import bazar from "../../../public/bazar.webp";
import gas from "../../../public/gas.jpg";
import readyFood from "../../../public/readyFood.jpg";
import electronics from "../../../public/elctronics.jpg";
import stationary from "../../../public/stationary.webp";
import mobile from "../../../public/mobile.png";

export default function AllService() {
  const { data: response, isLoading } = useGetAllServicesQuery({});
  const [fetchFullTree] = useLazyServiceHomeFullTreeQuery();
  const serviceRes = response?.data;

  const handleServiceClick = async (serviceId: string) => {
    try {
      await fetchFullTree(serviceId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Spinner />;

  // ✅ Map service names to imported images
  const serviceImages: Record<string, StaticImageData> = {
    "bazar": bazar,
    "gas": gas,
    "ready food/meal": readyFood,
    "fruits/organics": fruit,
    "electronics": electronics,
    "stationaries": stationary,
    "mobile accessories": mobile,
    "food": food,
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {serviceRes?.map((service: Service, index: number) => {
          const colors = [
            "bg-blue-100",
            "bg-green-100",
            "bg-yellow-100",
            "bg-pink-100",
            "bg-purple-100",
            "bg-orange-100",
            "bg-teal-100",
            "bg-red-100",
          ];


          const borderColors = [
            "border-blue-500",
            "border-green-500",
            "border-yellow-500",
            "border-pink-500",
            "border-purple-500",
            "border-orange-500",
            "border-teal-500",
            "border-red-500",
          ];

          const bgColor = colors[index % colors.length];
          const bColor = borderColors[index % borderColors.length];

          // Normalize service name for key lookup
          const key = service.name.toLowerCase().trim();
          const imageSrc = serviceImages[key] || food; // fallback to food image

          return (
            <Link
              key={service._id}
              href={`/${service.name.toLowerCase().replace(/\s/g, "-")}/${service._id}`}
              onClick={() => handleServiceClick(service._id)}
              className="transform hover:scale-105 transition duration-300"
            >
              <div
                className={`cursor-pointer border ${bColor} ${bgColor} rounded-lg p-4 flex flex-col items-center justify-center shadow-md hover:shadow-xl`}
              >
                <div className="w-20 h-20 relative mb-3">
                  <Image
                    src={imageSrc}
                    alt={service.name}
                    fill
                    sizes="80px"
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="text-center font-semibold text-base sm:text-lg">{service.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
