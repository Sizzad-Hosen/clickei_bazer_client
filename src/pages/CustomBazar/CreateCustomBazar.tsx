'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddCustomBazarProductMutation } from '@/redux/features/CustomBazar/customBazarApi';
import { UnitType } from '@/types/CustomBazar';

interface Subcategory {
  subcategory: string;
  unit: string;
  pricePerUnit: string; // keep as string for controlled input
  size: string;
}

interface ApiErrorResponse {
  data?: {
    message?: string;
  };
  error?: string;
}

export default function CustomBazarForm({ onSuccess }: { onSuccess?: () => void }) {
  const [category, setCategory] = useState('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    { subcategory: '', unit: '', pricePerUnit: '', size: '' },
  ]);
  const [apiError, setApiError] = useState<string | null>(null);

  const [addCustomBazar] = useAddCustomBazarProductMutation();

  const handleChange = (
    index: number,
    field: keyof Subcategory,
    value: string
  ) => {
    const updated = [...subcategories];
    updated[index][field] = value;
    setSubcategories(updated);
  };

  const addMore = () => {
    setSubcategories([
      ...subcategories,
      { subcategory: '', unit: '', pricePerUnit: '', size: '' },
    ]);
  };

  const validate = (): boolean => {
    if (!category.trim()) {
      toast.error('Category is required');
      return false;
    }

    for (const item of subcategories) {
      if (
        !item.subcategory.trim() ||
        !item.unit.trim() ||
        !item.pricePerUnit.trim() ||
        !item.size.trim()
      ) {
        toast.error('All subcategory fields are required');
        return false;
      }

      if (isNaN(Number(item.pricePerUnit)) || Number(item.pricePerUnit) <= 0) {
        toast.error('Price per unit must be a positive number');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await addCustomBazar({
        category,
        subcategories: subcategories.map((item) => ({
          name: item.subcategory,
          unit: item.unit as UnitType,
          pricePerUnit: Number(item.pricePerUnit),
          size: item.size,
        })),
      }).unwrap();

      console.log('result', res);

      setCategory('');
      setSubcategories([{ subcategory: '', unit: '', pricePerUnit: '', size: '' }]);
      setApiError(null);
      toast.success('Custom Bazar product added successfully!');

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      let message = 'Failed to add';

      const err = error as ApiErrorResponse;

      if (err.data?.message) {
        message = err.data.message;
      } else if (err.error) {
        message = err.error;
      }

      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6">Add Custom Bazar Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            Category
          </label>
          <Input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category name"
            className="w-full"
            required
          />
        </div>

        <h3 className="text-lg font-semibold mt-6">Subcategories</h3>
        {subcategories.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 items-end"
            aria-label={`Subcategory row ${index + 1}`}
          >
            {/* Subcategory */}
            <div>
              <label
                htmlFor={`subcategory-${index}`}
                className="block mb-1 font-medium"
              >
                Subcategory
              </label>
              <Input
                id={`subcategory-${index}`}
                type="text"
                value={item.subcategory}
                onChange={(e) =>
                  handleChange(index, 'subcategory', e.target.value)
                }
                placeholder="e.g. আলু"
                required
              />
            </div>

            {/* Unit */}
            <div>
              <label
                htmlFor={`unit-${index}`}
                className="block ps-4 mb-1 font-medium"
              >
                Unit
              </label>
              <Select
                value={item.unit}
                onValueChange={(value) => handleChange(index, 'unit', value)}
              >
                <SelectTrigger id={`unit-${index}`} className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="gm">gm</SelectItem>
                  <SelectItem value="litre">litre</SelectItem>
                  <SelectItem value="piece">piece</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            <div>
              <label
                htmlFor={`size-${index}`}
                className="block mb-1 font-medium"
              >
                Size
              </label>
              <Input
                id={`size-${index}`}
                type="text"
                value={item.size}
                onChange={(e) => handleChange(index, 'size', e.target.value)}
                placeholder="e.g. 1kg, 500g, Large, Medium"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor={`pricePerUnit-${index}`}
                className="block mb-1 font-medium"
              >
                Price 
              </label>
              <Input
                id={`pricePerUnit-${index}`}
                type="number"
                min={0}
                step="any"
                value={item.pricePerUnit}
                onChange={(e) =>
                  handleChange(index, 'pricePerUnit', e.target.value)
                }
                placeholder="e.g. 40"
                required
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addMore}
          className="mt-4"
        >
          + Add More Subcategory
        </Button>

        <Button variant="secondary" type="submit" className="mt-6 w-full">
          Add CustomBazar Product
        </Button>

        {apiError && <p className="text-red-500 mt-4">{apiError}</p>}
      </form>
    </div>
  );
}
