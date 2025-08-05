// CustomBazarForm.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddCustomBazarProductMutation } from '@/redux/features/CustomBazar/customBazarApi';

export default function CustomBazarForm() {
  const [category, setCategory] = useState('');
  const [subcategories, setSubcategories] = useState([
    { subcategory: '', unit: '', pricePerUnit: '' },
  ]);
  const [apiError, setApiError] = useState<string | null>(null);

  const [addCustomBazar] = useAddCustomBazarProductMutation();

  const handleChange = (
    index: number,
    field: 'subcategory' | 'unit' | 'pricePerUnit',
    value: string
  ) => {
    const updated = [...subcategories];
    updated[index][field] = value;
    setSubcategories(updated);
  };

  const addMore = () => {
    setSubcategories([
      ...subcategories,
      { subcategory: '', unit: '', pricePerUnit: '' },
    ]);
  };

  const validate = () => {
    if (!category.trim()) {
      toast.error('Category is required');
      return false;
    }

    for (const item of subcategories) {
      if (!item.subcategory.trim() || !item.unit.trim() || !item.pricePerUnit.toString().trim()) {
        toast.error('All subcategory fields are required');
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
          unit: item.unit,
          pricePerUnit: Number(item.pricePerUnit),
        })),
      }).unwrap();

console.log("result", res)

      toast.success('Custom Bazar Products added successfully');
      setCategory('');
      setSubcategories([{ subcategory: '', unit: '', pricePerUnit: '' }]);
      setApiError(null);
    } catch (error: any) {
      const message = error?.data?.message || error?.error || 'Failed to add';
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6">Add Custom Bazar Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category name"
            className="w-full"
          />
        </div>

        <h3 className="text-lg font-semibold mt-6">Subcategories</h3>
        {subcategories.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block mb-1">Subcategory</label>
              <Input
                type="text"
                value={item.subcategory}
                onChange={(e) =>
                  handleChange(index, 'subcategory', e.target.value)
                }
                placeholder="e.g. আলু"
              />
            </div>

            <div>
              <label className="block mb-1">Unit</label>
              <Select
                value={item.unit}
                onValueChange={(value) => handleChange(index, 'unit', value)}
              >
                <SelectTrigger className="w-full">
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

            <div>
              <label className="block mb-1">Price per Unit</label>
              <Input
                type="number"
                value={item.pricePerUnit}
                onChange={(e) =>
                  handleChange(index, 'pricePerUnit', e.target.value)
                }
                placeholder="e.g. 40"
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

        <Button type="submit" className="mt-6 w-full">
          Submit
        </Button>

        {apiError && <p className="text-red-500 mt-4">{apiError}</p>}
      </form>
    </div>
  );
}
