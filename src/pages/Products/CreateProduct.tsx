'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FromInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import { useGetAllCategoriesQuery } from '@/redux/features/Categories/categoryApi';
import { useGetAllSubCategoriesQuery } from '@/redux/features/SubCategories/subCategoryApi';
import { useAddProductMutation } from '@/redux/features/Products/productApi';

interface IProductSize {
  label: string;
  price: string;
}

const CreateProductPage = () => {
  const router = useRouter();

  const { data: serviceData } = useGetAllServicesQuery({});
  const { data: categoryData } = useGetAllCategoriesQuery({});
  const { data: subCategoryData } = useGetAllSubCategoriesQuery({});

  const [addProduct, { isLoading }] = useAddProductMutation();

  const [form, setForm] = useState({
    title: '',
    name: '',
    description: '',
    price: '',
    discount: '',
    stock: true, // stock as boolean now
    serviceId: '',
    categoryId: '',
    subCategoryId: '',
    isPublished: false,
    sizes: [] as IProductSize[],
  });

  const [files, setFiles] = useState<File[]>([]);

  // Map Bangla digits to English
  const banglaToEnglish = (str: string) => {
    if (!str) return '';
    const map: Record<string, string> = {
      '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'
    };
    return str.replace(/[০-৯]/g, (d) => map[d]);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;

    // Allow Bangla or English digits + dot for numeric fields
    if (['price', 'discount'].includes(e.target.name)) {
      value = value.replace(/[^0-9০-৯.]/g, '');
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleSelect = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleAddSize = () => {
    setForm({ ...form, sizes: [...form.sizes, { label: '', price: '' }] });
  };

  const handleRemoveSize = (index: number) => {
    const updatedSizes = form.sizes.filter((_, i) => i !== index);
    setForm({ ...form, sizes: updatedSizes });
  };

  const handleSizeChange = (index: number, field: 'label' | 'price', value: string) => {
    const updatedSizes = [...form.sizes];
    updatedSizes[index][field] = value;
    setForm({ ...form, sizes: updatedSizes });
  };

  const validateDiscount = () => {
    if (form.discount) {
      const discountNum = Number(banglaToEnglish(form.discount));
      if (discountNum < 0 || discountNum > 100) {
        toast.error('Discount must be between 0 and 100');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDiscount()) return;

    const payload = {
      ...form,
      price: Number(banglaToEnglish(form.price)) || 0,
      discount: Number(banglaToEnglish(form.discount)) || 0,
      // stock stays boolean
      sizes: form.sizes.map(s => ({ label: s.label, price: Number(banglaToEnglish(s.price)) || 0 })),
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    files.forEach((file) => formData.append('file', file));

    function isErrorWithMessage(err: unknown): err is { data?: { message?: string } } {
      return (
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: unknown }).data === 'object' &&
        (err as { data?: unknown }).data !== null
      );
    }

    try {
      await addProduct(formData).unwrap();
      toast.success('Product created successfully!');
      router.push('/dashboard/products');
    } catch (err: unknown) {
      if (isErrorWithMessage(err)) {
        toast.error(err.data?.message || 'Something went wrong while creating the product');
      } else {
        toast.error('Something went wrong while creating the product');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter product title"
          required
        />

        <FormInput
          label="Name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />

        <div>
          <Label className="mb-1 block font-semibold">Description</Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-amber-500"
            placeholder="Enter product description"
            rows={5}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Price (৳)"
            name="price"
            type="text"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price (Bangla or English)"
            required
          />
          <FormInput
            label="Discount (%)"
            name="discount"
            type="text"
            value={form.discount}
            onChange={handleChange}
            placeholder="Enter discount (Bangla or English)"
          />
        </div>

        {/* Stock as Switch */}
        <div className="flex items-center gap-3">
          <Label className="font-semibold">In Stock</Label>
          <Switch
            checked={form.stock}
            onCheckedChange={(val) => setForm({ ...form, stock: val })}
          />
        </div>

        {/* Sizes Section */}
        <div>
          <Label className="mb-1 block font-semibold">Product Sizes</Label>
          {form.sizes.map((size, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Size Label (e.g., 500 gm)"
                value={size.label}
                onChange={(e) => handleSizeChange(index, 'label', e.target.value)}
                className="px-3 py-2 border rounded-md w-1/2"
                required
              />
              <input
                type="text"
                placeholder="Price"
                value={size.price}
                onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                className="px-3 py-2 border rounded-md w-1/2"
                required
              />
              <Button type="button" variant="destructive" onClick={() => handleRemoveSize(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button className='text-black bg-amber-400 hover:text-black' type="button" onClick={handleAddSize}>
            Add Size
          </Button>
        </div>

        {/* File Upload */}
        <div>
          <Label className="mb-1 block font-semibold">Upload Images</Label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md cursor-pointer"
            required
          />
        </div>

        {/* Select Service */}
        <div>
          <Label className="mb-1 block font-semibold">Select Service</Label>
          <Select onValueChange={(val) => handleSelect('serviceId', val)} value={form.serviceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose service" />
            </SelectTrigger>
            <SelectContent>
              {serviceData?.data?.map((service) => (
                <SelectItem key={service._id} value={service._id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Category */}
        <div>
          <Label className="mb-1 block font-semibold">Select Category</Label>
          <Select onValueChange={(val) => handleSelect('categoryId', val)} value={form.categoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {categoryData?.data?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Subcategory */}
        <div>
          <Label className="mb-1 block font-semibold">Select Subcategory</Label>
          <Select onValueChange={(val) => handleSelect('subCategoryId', val)} value={form.subCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subCategoryData?.data?.map((sub) => (
                <SelectItem key={sub._id} value={sub._id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Publish */}
        <div className="flex items-center gap-3">
          <Label className="font-semibold">Publish</Label>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(val) => setForm({ ...form, isPublished: val })}
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Create Product'}
        </Button>
      </form>
    </div>
  );
};

export default CreateProductPage;
