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

import { useAddProductMutation } from '@/redux/features/Products/productApi';
import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import { useGetAllCategoriesQuery } from '@/redux/features/Categories/categoryApi';
import { useGetAllSubCategoriesQuery } from '@/redux/features/SubCategories/subCategoryApi';

const CreateProductPage = () => {
  const router = useRouter();
  const [addProduct] = useAddProductMutation();
  const { data: serviceData } = useGetAllServicesQuery({});
  const { data: categoryData } = useGetAllCategoriesQuery({});
  const { data: subCategoryData } = useGetAllSubCategoriesQuery({});

  const [form, setForm] = useState({
    title: '',
    name: '',
    description: '',
    images: [''],
    price: '',
    quantity: '',
    serviceId: '',
    categoryId: '',
    subCategoryId: '',
    isPublished: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm({ ...form, images: updatedImages });
  };

  const handleAddImageField = () => {
    setForm({ ...form, images: [...form.images, ''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      await addProduct(payload).unwrap();
      toast.success('Product created successfully!');
      router.push('/dashboard/products');
    } catch (error) {
      toast.error('Failed to create product');
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Enter description"
            required
          />
        </div>

        <div>
          <Label>Images</Label>
          {form.images.map((url, idx) => (
            <input
              key={idx}
              type="text"
              value={url}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              placeholder={`Image URL ${idx + 1}`}
              className="w-full mb-2 px-4 py-2 border rounded-md"
              required
            />
          ))}
          <Button type="button" variant="outline" onClick={handleAddImageField}>
            + Add Image
          </Button>
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
