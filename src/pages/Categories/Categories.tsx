'use client';

import { ChangeEvent, useState } from 'react';
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/redux/features/Categories/categoryApi';
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
import { FormInput } from '@/components/form/FromInput';
import Spinner from '@/components/Spinner';
import { Category } from '@/types/products';

const CategoriesPage = () => {
  const { data, isLoading, isError, refetch } = useGetAllCategoriesQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const categories: Category[] = Array.isArray(data)
    ? data
    : data?.data || [];

  // State for modal
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

const [formData, setFormData] = useState<{ name: string; serviceId: string }>({
  name: '',
  serviceId: '',  // initialize empty string or some default value
});

const openEditModal = (category: Category) => {
  setSelectedCategory(category);
  setFormData({ name: category.name, serviceId: category._id });
  setIsOpen(true);
};


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully!');
      refetch();
    } catch {
      toast.error('Failed to delete category');
    }
  };

const handleSave = async () => {
  if (!selectedCategory) return;

  // Assuming you have serviceId in your form state
  if (!formData.serviceId) {
    toast.error('Service is required');
    return;
  }

  try {
    await updateCategory({
      id: selectedCategory._id,
      ...formData,
    }).unwrap();
    toast.success('Category updated!');
    setIsOpen(false);
    refetch();
  } catch (error: unknown) {
  console.error('Update failed', error);

  // Type guard to safely access error properties
  if (error instanceof Error) {
    toast.error(error.message || 'Failed to update category');
  } else if (typeof error === 'object' && error !== null && 'data' in error) {
   
    toast.error( 'Failed to update category');
  } else {
    toast.error('Failed to update category');
  }
}
}

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Categories</h1>
      </div>

      {isLoading && <Spinner />}
      {isError && <p>Failed to load categories</p>}
      {!isLoading && categories.length === 0 && <p>No categories found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category._id}
            className="rounded-2xl border shadow-sm p-4 bg-muted/50"
          >
            <CardHeader className="text-lg font-semibold">{category.name}</CardHeader>
            <CardContent className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditModal(category)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(category._id)}
              >
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

          <div className="py-4">
            <FormInput
              label="Category Name"
              name="name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
