'use client';

import React, { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

import { useGetAllCategoriesQuery } from '@/redux/features/Categories/categoryApi';
import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import {
  useDeleteSubCategoryMutation,
  useGetAllSubCategoriesQuery,
  useUpdateSubCategoryMutation,
} from '@/redux/features/SubCategories/subCategoryApi';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import Spinner from '@/components/Spinner';

// Define interfaces for data models
interface Subcategory {
  _id: string;
  name: string;
  serviceId: string;
  categoryId: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Service {
  _id: string;
  name: string;
}

const SubcategoriesPage: React.FC = () => {
  const { data: subcategoryData, isLoading, isError, refetch } = useGetAllSubCategoriesQuery({});
  const { data: categoryData } = useGetAllCategoriesQuery({});
  const { data: serviceData } = useGetAllServicesQuery({});

  const [deleteSubcategory] = useDeleteSubCategoryMutation();
  const [updateSubcategory] = useUpdateSubCategoryMutation();

  // Normalize data arrays
  const subcategories: Subcategory[] = Array.isArray(subcategoryData)
    ? subcategoryData
    : subcategoryData?.data || [];

  const categories: Category[] = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.data || [];

  const services: Service[] = Array.isArray(serviceData)
    ? serviceData
    : serviceData?.data || [];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    serviceId: '',
    categoryId: '',
  });

  const openEditModal = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData({
      name: subcategory.name || '',
      serviceId: subcategory.serviceId || '',
      categoryId: subcategory.categoryId || '',
    });
    setIsOpen(true);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, categoryId: value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, serviceId: value });
  };

  // SweetAlert2 confirm delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This subcategory will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteSubcategory(id).unwrap();
        toast.success('Subcategory deleted successfully!');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete subcategory');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.serviceId || !formData.categoryId) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!selectedSubcategory) {
      toast.error('No subcategory selected');
      return;
    }

    try {
      await updateSubcategory({
        id: selectedSubcategory._id,
        ...formData,
      }).unwrap();
      toast.success('Subcategory updated!');
      setIsOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update subcategory');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Subcategories</h1>
      </div>

      {isLoading && <Spinner />}
      {isError && <p>Failed to load subcategories</p>}
      {!isLoading && subcategories.length === 0 && <p>No subcategories found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((subcategory) => (
          <Card key={subcategory._id} className="rounded-2xl border shadow-sm p-4 bg-muted/50">
            <CardHeader className="text-lg font-semibold">{subcategory.name}</CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEditModal(subcategory)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(subcategory._id)}>
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
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormInput
              label="Subcategory Name"
              name="name"
              type="text"
              placeholder="Enter subcategory name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Service Select */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Select Service</label>
              <Select value={formData.serviceId} onValueChange={handleServiceChange}>
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
              <label className="text-sm font-medium text-gray-700">Select Category</label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
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
          </div>

          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubcategoriesPage;
