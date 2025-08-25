"use client";
import Link from "next/link";
import { useGetAllServicesQuery, useLazyServiceHomeFullTreeQuery } from "@/redux/features/Services/serviceApi";
import Spinner from "../Spinner";
import { Service } from "@/types/products";

export default function AllService() {
  const { data: response, isLoading } = useGetAllServicesQuery({});
  const [fetchFullTree] = useLazyServiceHomeFullTreeQuery();
  const serviceRes = response?.data;

  const handleServiceClick = async (serviceId: string) => {
    await fetchFullTree(serviceId).unwrap().catch(console.error); // always fetch
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Services</h1>

     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
  {serviceRes?.map((service: Service, index: number) => {
    const colors = ["bg-blue-100","bg-green-100","bg-yellow-100","bg-pink-100","bg-purple-100","bg-orange-100","bg-teal-100","bg-red-100"];
    const borderColors = ["border-blue-500","border-green-500","border-yellow-500","border-pink-500","border-purple-500","border-orange-500","border-teal-500","border-red-500"];
    const bgColor = colors[index % colors.length];
    const bColor = borderColors[index % borderColors.length];

    return (
      <Link
        key={service._id}
        href={`/${service.name.toLowerCase()}/${service._id}`}
        onClick={() => handleServiceClick(service._id)}
      >
        <div
          className={`cursor-pointer border ${bColor} ${bgColor} hover:shadow-lg transition p-4 rounded-lg text-center`}
        >
          {/* ✅ allow wrapping so full name shows */}
          <p className="font-semibold text-base sm:text-lg break-words whitespace-normal">
            {service.name}
          </p>
        </div>
      </Link>
    );
  })}
</div>



    </div>
  );
}
