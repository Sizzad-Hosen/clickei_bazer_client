"use client";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";


export default function SubCategoryItem({ subCategory, onProductSelect }: any) {

  const [expanded, setExpanded] = useState(false);

  const { data: products, isLoading } = useGetProductsBySubCategoryQuery(
    subCategory._id,
    { skip: !expanded }
  );


  return (
    <div className="rounded cursor-pointer">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between hover:bg-gray-100 p-2"
      >
        <span>{subCategory.name}</span>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {expanded && (
        <div className="ml-4 border-l pl-2 space-y-1">
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading...</div>
          ) : (
            products?.data?.map((product: any) => (
              <div
                key={product._id}
                onClick={() => onProductSelect(product)}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
              >
                {product.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}