'use client';

import { ChangeEvent, useState } from 'react';
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
import { Category, Service } from '@/types/products';

const CreateSubcategoryPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    serviceId: '',
    categoryId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addSubcategory] = useAddSubCategoryMutation();
  const { data: servicesData } = useGetAllServicesQuery({});
  const { data: categoriesData } = useGetAllCategoriesQuery({});

  const services: Service[] = servicesData?.data || servicesData || [];
  const categories: Category[] = categoriesData?.data || categoriesData || [];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleServiceChange = (value: string) => {
    setForm((prev) => ({ ...prev, serviceId: value }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.serviceId || !form.categoryId) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        serviceId: form.serviceId,
        categoryId: form.categoryId,
      };

      const res = await addSubcategory(payload).unwrap();

      toast.success(res?.message || 'Subcategory created successfully');
      router.push('/dashboard/subCategories');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create subcategory');
    } finally {
      setIsSubmitting(false);
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
              {services.map((service) => (
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
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
          {isSubmitting && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {isSubmitting ? 'Processing...' : 'Create Subcategory'}
        </Button>
      </form>
    </div>
  );
};

export default CreateSubcategoryPage;
