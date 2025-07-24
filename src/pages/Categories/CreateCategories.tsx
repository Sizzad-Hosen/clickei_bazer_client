'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/redux/features/Categories/categoryApi';
import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormInput } from '@/components/form/FromInput';


const CategoriesPage = () => {
  const router = useRouter();

  const { data: categoryData, isLoading, isError, refetch } = useGetAllCategoriesQuery({});
  const { data: serviceData } = useGetAllServicesQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const categories = Array.isArray(categoryData) ? categoryData : categoryData?.data || [];
  const services = Array.isArray(serviceData) ? serviceData : serviceData?.data || [];

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', serviceId: '' });

  const openEditModal = (category: any) => {
    console.log('Open modal for category:', category);
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      // Make sure serviceId is a string
      serviceId: category.serviceId ? category.serviceId.toString() : '',
    });
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (value: string) => {
    console.log('Service selected:', value);
    setFormData({ ...formData, serviceId: value });
  };

  const handleDelete = async (id: string) => {
   
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleSave = async () => {
    console.log('Saving form data:', formData);
    try {
      await updateCategory({
        id: selectedCategory._id,
        name: formData.name,
        serviceId: formData.serviceId,
      }).unwrap();
      toast.success('Category updated!');
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Categories</h1>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load categories</p>}
      {categories.length === 0 && <p>No categories found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: any) => (
          <Card key={category._id} className="rounded-2xl border shadow-sm p-4 bg-muted/50">
            <CardHeader className="text-lg font-semibold">{category.name}</CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEditModal(category)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(category._id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
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
                value={formData.serviceId || ''}
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
          </div>

          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
