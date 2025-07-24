'use client';

import { useState } from 'react';
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
const [addProduct]= useAddProductMutation()
  const [form, setForm] = useState({
    title: '',
    name: '',
    description: '',
    price: '',
    quantity: '',
    serviceId: '',
    categoryId: '',
    subCategoryId: '',
    isPublished: false,
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    const formData = new FormData();

    formData.append('data', JSON.stringify(payload));

    files.forEach((file) => {
      formData.append('file', file);
    });

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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

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
          <Label>Description</Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter product description"
            required
          />
        </div>

        <FormInput
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Enter price"
          required
        />

        <FormInput
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          required
        />

        {/* File Upload */}
        <div>
          <Label>Upload Images</Label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Service Select */}
        <div>
          <Label>Select Service</Label>
          <Select onValueChange={(val) => handleSelect('serviceId', val)}>
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
          <Label>Select Category</Label>
          <Select onValueChange={(val) => handleSelect('categoryId', val)}>
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
          <Label>Select Subcategory</Label>
          <Select onValueChange={(val) => handleSelect('subCategoryId', val)}>
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
          <Label>Publish</Label>
          <Switch
            checked={form.isPublished}
            onCheckedChange={(val) => setForm({ ...form, isPublished: val })}
          />
        </div>

        <Button type="submit">Create Product</Button>
      </form>
    </div>
  );
};

export default CreateProductPage;
