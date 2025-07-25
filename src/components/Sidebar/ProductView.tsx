"use client";
import { ChevronRight } from "lucide-react";

export default function ProductView({ product, onBack }: any) {
  return (
    <div className="w-64 bg-white border-r p-4 min-h-screen">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ChevronRight className="w-4 h-4 transform rotate-180" />
        <span className="ml-1">Back</span>
      </button>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-medium text-lg">{product.name}</h3>
        <div className="mt-2 text-gray-600">
          {product.weight && <p>{product.weight} gm</p>}
          <p>{product.price} Tk</p>
        </div>
        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Add to bag
        </button>
      </div>
    </div>
  );
}