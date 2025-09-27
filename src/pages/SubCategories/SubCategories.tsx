'use client';

import React, { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { useGetAllCategoriesQuery } from '@/redux/features/Categories/categoryApi';
import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import {
  useDeleteSubCategoryMutation,
  useGetAllSubCategoriesQuery,
  useUpdateSubCategoryMutation,
} from '@/redux/features/SubCategories/subCategoryApi';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Input } from '@/components/ui/input';
import Spinner from '@/components/Spinner';
import CreateSubcategoryPage from './CreateSubCategory';

// Interfaces
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

  // Normalize arrays
  const subcategories: Subcategory[] = Array.isArray(subcategoryData)
    ? subcategoryData
    : subcategoryData?.data || [];

  const categories: Category[] = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.data || [];

  const services: Service[] = Array.isArray(serviceData)
    ? serviceData
    : serviceData?.data || [];

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);
  const paginatedSubcategories = subcategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  // Add Service modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  // Modal
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, categoryId: value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, serviceId: value });
  };

  // Delete
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

  // Save
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
            <Button
                  variant="secondary"
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add SubCategory
                </Button>
      </div>

      {isLoading && <Spinner />}
      {isError && <p className="text-red-500">Failed to load subcategories</p>}

      {!isLoading && !isError && (
        <>
          <Table className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <TableCaption>A list of all available subcategories</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-16">#</TableHead>
                <TableHead>Subcategory Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubcategories.length > 0 ? (
                paginatedSubcategories.map((subcat, index) => (
                  <TableRow key={subcat._id} className="hover:bg-gray-50 transition">
                    <TableCell className="font-medium">
                      {(page - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{subcat.name}</TableCell>
                    <TableCell>
                      {services.find((s) => s._id === subcat.serviceId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {categories.find((c) => c._id === subcat.categoryId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(subcat)}
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(subcat._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                    No subcategories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination (always visible) */}
          <div className="flex justify-end items-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter subcategory name"
              className="focus:ring-2 focus:ring-primary"
            />

            <div>
              <label className="text-sm font-medium text-gray-700">Select Service</label>
              <Select value={formData.serviceId} onValueChange={handleServiceChange}>
                <SelectTrigger className="w-full mt-1">
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

            <div>
              <label className="text-sm font-medium text-gray-700">Select Category</label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full mt-1">
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
            <Button variant="secondary" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
        {/* Add subcategoryModal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <CreateSubcategoryPage
            onSuccess={() => {
              setIsAddOpen(false); // close modal
              refetch();           // refresh service list
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubcategoriesPage;
