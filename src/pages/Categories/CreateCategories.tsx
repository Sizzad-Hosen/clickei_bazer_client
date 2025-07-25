'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';

import { FormInput } from '@/components/form/FromInput';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAddCategoryMutation } from '@/redux/features/Categories/categoryApi';

const CreateCategoryPage = () => {
  const router = useRouter();
  const [createCategory] = useAddCategoryMutation();
  const { data: serviceData } = useGetAllServicesQuery({});

  const services = Array.isArray(serviceData) ? serviceData : serviceData?.data || [];

  const [formData, setFormData] = useState({
    name: '',
    serviceId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, serviceId: value });
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.serviceId) {
    toast.error('Please fill in all fields');
    return;
  }

  try {
    await createCategory(formData).unwrap();

    toast.success('Category created successfully!');
    setFormData({ name: '', serviceId: '' });
    router.push('/dashboard/categories');
  } catch (error: any) {
    if (error?.data?.errorSources) {
      error.data.errorSources.forEach((err: any) => {
        toast.error(`${err.path.replace('body.', '')}: ${err.message}`);
      });
    } else {
      toast.error('Failed to create category');
    }
  }
};

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card className="rounded-2xl border shadow-sm p-6 bg-muted/50">
        <CardHeader className="text-xl font-semibold mb-4">Create New Category</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Category Name"
              name="name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="space-y-1">
              <label htmlFor="serviceId" className="text-sm font-medium text-gray-700">
                Select Service
              </label>
              <Select
                onValueChange={handleServiceChange}
                value={formData.serviceId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service: any) => (
                    <SelectItem key={service._id} value={service._id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Create Category
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCategoryPage;
