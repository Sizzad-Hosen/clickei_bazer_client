'use client';

import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/redux/features/Categories/categoryApi';

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
import { Input } from '@/components/ui/input';
import Spinner from '@/components/Spinner';
import { Category } from '@/types/products';
import CreateCategoryPage from './CreateCategories';

const CategoriesPage = () => {
  const { data, isLoading, isError, refetch } = useGetAllCategoriesQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const categories: Category[] = Array.isArray(data) ? data : data?.data || [];

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setIsOpen(true);
  };

    // Add Service modal
    const [isAddOpen, setIsAddOpen] = useState(false);
  
    

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This category will be permanently deleted!',
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
        await deleteCategory(id).unwrap();
        toast.success('Category deleted successfully!');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleSave = async () => {
    if (!selectedCategory) return;
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      await updateCategory({ id: selectedCategory._id, ...formData }).unwrap();
      toast.success('Category updated!');
      setIsOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update category');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Categories</h1>
        <Button
                  variant="secondary"
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </Button>
      </div>

      {isLoading && <Spinner />}
      {isError && <p className="text-red-500">Failed to load categories</p>}

      {!isLoading && !isError && (
        <>
          <Table className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <TableCaption>A list of all available categories</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-16">#</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category, index) => (
                  <TableRow key={category._id} className="hover:bg-gray-50 transition">
                    <TableCell className="font-medium">
                      {(page - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(category)}
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-6">
                    No categories found
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
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="focus:ring-2 focus:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
        {/* Add Service Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <CreateCategoryPage
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

export default CategoriesPage;
