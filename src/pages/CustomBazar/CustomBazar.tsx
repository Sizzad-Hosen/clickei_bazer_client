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
  price: number;
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

console.log(selections)

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
  console.log("Selected categoryId:", categoryId);
  console.log("Selected subcategory:", sub);

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
      const price = item.selectedSub.price || 0;
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🛒 কাস্টম বাজার অর্ডার</h2>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {categories.map(category => {
          const selection = selections[category._id];
          const selected = selection?.selectedSub;

          return (
            <div
              key={category._id}
              className="flex flex-wrap items-center gap-3 border p-3 rounded shadow-sm"
            >
              <div className="w-32 font-semibold">{category.category}</div>

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
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      −
                    </button>

                    <span>{selection?.quantity}</span>
                    <span>{selection?.selectedSub?.unit}</span>

                    <button
                      onClick={() => handleQuantityChange(category._id, 1)}
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      +
                    </button>
                  </div>

                  <div className="ml-auto font-bold text-blue-600">
                    {selection.quantity * selected?.pricePerUnit
}৳
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t pt-4 text-right">
        <div className="text-lg font-bold">মোট অর্ডার মূল্য: {getTotalPrice()}৳</div>
        <button
          onClick={handleSubmitOrder}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          অর্ডার সাবমিট করুন
        </button>
      </div>
    </div>
  );
};

export default CustomBazarPage;
