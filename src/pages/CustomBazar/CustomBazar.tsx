'use client';

import React, { useState, useEffect } from 'react';
import {
  useAddCustomBazarOrderMutation,
  useGetAllCustomBazarProductsQuery,
} from '@/redux/features/CustomBazar/customBazarApi';
import Spinner from '@/components/Spinner';

interface Subcategory {
  _id: string;
  name: string;
  pricePerUnit: number;
  units?: string[];
}

interface Category {
  _id: string;
  category: string;
  subcategories: Subcategory[];
}

interface Selection {
  selectedSub: Subcategory;
  quantity: number;
  unit: string;
}

const CustomBazarPage = () => {
  const { data, isLoading, isError } = useGetAllCustomBazarProductsQuery();
  const [addCustomBazarOrder] = useAddCustomBazarOrderMutation();
  const [selections, setSelections] = useState<Record<string, Selection>>({});

  useEffect(() => {
    if (!data?.data) return;

    const initialSelections: Record<string, Selection> = {};
    data.data.forEach((cat: Category) => {
      if (cat.subcategories.length > 0) {
        const sub = cat.subcategories[0];
        initialSelections[cat._id] = {
          selectedSub: sub,
          quantity: 1,
          unit: sub.units?.[0] || '',
        };
      }
    });
    setSelections(initialSelections);
  }, [data]);

  const categories: Category[] = data?.data || [];

  const handleSubcategoryChange = (categoryId: string, sub: Subcategory) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: {
        selectedSub: sub,
        quantity: 1,
        unit: sub.units?.[0] || '',
      },
    }));
  };

  const handleQuantityChange = (categoryId: string, delta: number) => {
    setSelections(prev => {
      const current = prev[categoryId];
      const newQty = Math.max(1, (current.quantity || 1) + delta);
      return {
        ...prev,
        [categoryId]: {
          ...current,
          quantity: newQty,
        },
      };
    });
  };

  const handleUnitChange = (categoryId: string, unit: string) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        unit,
      },
    }));
  };

  const getTotalPrice = () => {
    return Object.values(selections).reduce((acc, item) => {
      const price = item.selectedSub.pricePerUnit || 0;
      const qty = item.quantity || 1;
      return acc + price * qty;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    const orderItems = Object.entries(selections).map(
      ([_, { selectedSub, quantity }]) => ({
        product: selectedSub._id,
        quantity,
      })
    );

    const payload = {
      orderItems,
      status: 'pending',
    };

    try {
      const response = await addCustomBazarOrder(payload).unwrap();
      alert('✅ অর্ডার সফলভাবে সাবমিট হয়েছে!');
    } catch (error) {
      console.error('❌ অর্ডার সাবমিট করতে সমস্যা হয়েছে:', error);
      alert('❌ অর্ডার সাবমিট করতে সমস্যা হয়েছে');
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <p className="text-red-500">Failed to load products.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 কাস্টম বাজার অর্ডার</h2>

      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
        {categories.map(category => {
          const selection = selections[category._id];
          const selected = selection?.selectedSub;

          return (
            <div
              key={category._id}
              className="flex flex-wrap items-center gap-3 border p-4 rounded-lg shadow-sm bg-white"
            >
              <div className="w-32 font-semibold text-gray-700">{category.category}</div>

              <select
                className="border px-2 py-1 rounded"
                value={selections[category._id]?.selectedSub?.name || ''}
                onChange={e => {
                  const sub = category?.subcategories.find(s => s.name === e.target.value);
                  if (sub) handleSubcategoryChange(category._id, sub);
                }}
              >
                <option value="">সাব-ক্যাটেগরি নির্বাচন করুন</option>
                {category?.subcategories?.map(sub => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name} - {sub?.pricePerUnit}৳
                  </option>
                ))}
              </select>

              {selected && (
                <>
                  <select
                    className="border px-2 py-1 rounded"
                    value={selection.unit}
                    onChange={e => handleUnitChange(category._id, e.target.value)}
                  >
                    {selected.units?.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(category._id, -1)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      −
                    </button>

                    <span className="px-2 text-lg font-semibold">
                      {selection.quantity}
                    </span>

                    <span className="text-sm text-gray-600">{selection?.unit}</span>

                    <button
                      onClick={() => handleQuantityChange(category._id, 1)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>

                  <div className="ml-auto font-bold text-blue-700 text-lg">
                    {selection.quantity * selected?.pricePerUnit}৳
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t pt-4 flex flex-col items-end">
        <div className="text-xl font-bold text-gray-800">
          মোট অর্ডার মূল্য: <span className="text-green-600">{getTotalPrice()}৳</span>
        </div>
        <button
          onClick={handleSubmitOrder}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
        >
          অর্ডার সাবমিট করুন
        </button>
      </div>
    </div>
  );
};

export default CustomBazarPage;
