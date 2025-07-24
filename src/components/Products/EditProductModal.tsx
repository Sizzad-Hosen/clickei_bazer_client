'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { useUpdateProductMutation } from '@/redux/features/Products/productApi';
import { useState } from 'react';
import { toast } from 'sonner';
import { FormInput } from '../form/FromInput';

interface EditProductModalProps {
  product: {
    _id: string;
    name: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductModal = ({
  product,
  isOpen,
  onClose,
}: EditProductModalProps) => {
  const [form, setForm] = useState({ ...product });
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct({ id: product._id, data: form }).unwrap();
      toast.success('Product updated successfully!');
      onClose();
    } catch {
      toast.error('Failed to update product.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Name"
            type='text'
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Title"
            type='text'
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Description"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Price"
            name="price"
            type="number"
            value={form.price.toString()}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity.toString()}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
