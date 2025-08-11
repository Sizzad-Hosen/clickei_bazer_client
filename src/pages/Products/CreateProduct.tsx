'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FromInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import { useGetAllCategoriesQuery } from '@/redux/features/Categories/categoryApi';
import { useGetAllSubCategoriesQuery } from '@/redux/features/SubCategories/subCategoryApi';
import { useAddProductMutation } from '@/redux/features/Products/productApi';

const CreateProductPage = () => {
  const router = useRouter();

  const { data: serviceData } = useGetAllServicesQuery({});
  const { data: categoryData } = useGetAllCategoriesQuery({});
  const { data: subCategoryData } = useGetAllSubCategoriesQuery({});

  const [addProduct] = useAddProductMutation();

  const [form, setForm] = useState({
    title: '',
    name: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    serviceId: '',
    categoryId: '',
    subCategoryId: '',
    isPublished: false,
  });

  const [files, setFiles] = useState<File[]>([]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};


  const handleSelect = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Simple validation for discount price
const validateDiscount = () => {
  if (form.discount) {
    const discountNum = Number(form.discount);
    if (discountNum < 0 || discountNum > 100) {
      toast.error('Discount percentage must be between 0 and 100');
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
  price: Number(form.price),
  discount: form.discount ? Number(form.discount) : 0, // as percent
  quantity: Number(form.quantity),
};


    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    files.forEach((file) => formData.append('file', file));

    try {
      await addProduct(formData).unwrap();
      toast.success('Product created successfully!');
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while creating the product');
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
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            min={0}
            step="0.01"
            required
          />
<FormInput
  label="Discount (%)"
  name="discount"
  type="number"
  value={form.discount}
  onChange={handleChange}
  placeholder="Enter discount percentage (optional)"
  min={0}
  max={100}
  step="0.01"
/>

        </div>

        <FormInput
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          min={1}
          required
        />

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

        {/* Service Select */}
        <div>
          <Label className="mb-1 block font-semibold">Select Service</Label>
          <Select onValueChange={(val) => handleSelect('serviceId', val)} value={form.serviceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose service" />
            </SelectTrigger>
            <SelectContent>
              {serviceData?.data?.map((service: any) => (
                <SelectItem key={service._id} value={service._id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div>
          <Label className="mb-1 block font-semibold">Select Category</Label>
          <Select onValueChange={(val) => handleSelect('categoryId', val)} value={form.categoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {categoryData?.data?.map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory Select */}
        <div>
          <Label className="mb-1 block font-semibold">Select Subcategory</Label>
          <Select onValueChange={(val) => handleSelect('subCategoryId', val)} value={form.subCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subCategoryData?.data?.map((sub: any) => (
                <SelectItem key={sub._id} value={sub._id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* isPublished toggle */}
        <div className="flex items-center gap-3">
          <Label className="font-semibold">Publish</Label>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(val) => setForm({ ...form, isPublished: val })}
          />
        </div>

        <Button type="submit" variant={"secondary"} className="w-full">
          Create Product
        </Button>
      </form>
    </div>
  );
};

export default CreateProductPage;
