'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import { useGetAllCategoriesQuery } from '@/redux/features/Categories/categoryApi';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/form/FromInput';
import { useAddSubCategoryMutation } from '@/redux/features/SubCategories/subCategoryApi';

const CreateSubcategoryPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    serviceId: '',
    categoryId: '',
  });

  const [addSubcategory] = useAddSubCategoryMutation();
  const { data: servicesData } = useGetAllServicesQuery({});
  const { data: categoriesData } = useGetAllCategoriesQuery({});

  const services = Array.isArray(servicesData) ? servicesData : servicesData?.data || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (value: string) => {
    setForm({ ...form, serviceId: value });
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, categoryId: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.serviceId || !form.categoryId) {
      toast.error('All fields are required');
      return;
    }

    try {
      await addSubcategory(form).unwrap();
      toast.success('Subcategory created successfully');
      router.push('/dashboard/subCategories');
    } catch (error) {
      toast.error('Failed to create subcategory');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Subcategory</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subcategory Name */}
        <FormInput
          label="Subcategory Name"
          name="name"
          type="text"
          placeholder="Enter subcategory name"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Service Select */}
        <div className="space-y-1">
          <Label>Select Service</Label>
          <Select onValueChange={handleServiceChange} value={form.serviceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service: any) => (
                <SelectItem key={service._id} value={service._id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div className="space-y-1">
          <Label>Select Category</Label>
          <Select onValueChange={handleCategoryChange} value={form.categoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: any) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button type="submit">Create Subcategory</Button>
      </form>
    </div>
  );
};

export default CreateSubcategoryPage;
