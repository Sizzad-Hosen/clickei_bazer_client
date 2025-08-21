'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FormInput } from '@/components/form/FromInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { useGetAllServicesQuery } from '@/redux/features/Services/serviceApi';
import { useGetAllCategoriesQuery } from '@/redux/features/Categories/categoryApi';
import { useGetAllSubCategoriesQuery } from '@/redux/features/SubCategories/subCategoryApi';
import { useUpdateProductMutation } from '@/redux/features/Products/productApi';

interface IProductSize {
  label: string;
  price: string;
}

interface IEditProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const EditProductModal = ({ product, isOpen, onClose }: IEditProductModalProps) => {
  const router = useRouter();

  const { data: serviceData } = useGetAllServicesQuery({});
  const { data: categoryData } = useGetAllCategoriesQuery({});
  const { data: subCategoryData } = useGetAllSubCategoriesQuery({});

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const [form, setForm] = useState({
    title: '',
    name: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    serviceId: '',
    categoryId: '',
    subCategoryId: '',
    isPublished: false,
    sizes: [] as IProductSize[],
  });

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '',
        stock: product.stock?.toString() || '',
        serviceId: product.serviceId || '',
        categoryId: product.categoryId || '',
        subCategoryId: product.subCategoryId || '',
        isPublished: product.isPublished || false,
        sizes: product.sizes?.map((s: any) => ({
          label: s.label,
          price: s.price?.toString() || '0',
        })) || [],
      });
    }
  }, [product]);

  const banglaToEnglish = (str: string) => {
    if (!str) return '';
    const map: Record<string, string> = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
    return str.replace(/[০-৯]/g, (d) => map[d]);
  };

  const handleChange = ( e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (['price', 'discount', 'stock'].includes(e.target.name)) {
      value = value.replace(/[^0-9০-৯.]/g, '');
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSelect = (field: string, value: string) => setForm({ ...form, [field]: value });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };
  const handleAddSize = () => setForm({ ...form, sizes: [...form.sizes, { label: '', price: '' }] });
  const handleRemoveSize = (index: number) => setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) });
  const handleSizeChange = (index: number, field: 'label' | 'price', value: string) => {
    const updatedSizes = [...form.sizes];
    updatedSizes[index][field] = value;
    setForm({ ...form, sizes: updatedSizes });
  };
  const validateDiscount = () => {
    if (form.discount) {
      const discountNum = Number(banglaToEnglish(form.discount));
      if (discountNum < 0 || discountNum > 100) {
        toast.error('Discount must be between 0 and 100');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDiscount()) return;

    const payload = {
      ...form,
      price: Number(banglaToEnglish(form.price)) || 0,
      discount: Number(banglaToEnglish(form.discount)) || 0,
      stock: banglaToEnglish(form.stock),
      sizes: form.sizes.map(s => ({ label: s.label, price: Number(banglaToEnglish(s.price)) || 0 })),
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    files.forEach((file) => formData.append('file', file));

    try {
      await updateProduct({ id: product._id, formData }).unwrap();
      toast.success('Product updated successfully!');
      onClose();
      router.refresh(); // refresh the page to reflect changes
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong while updating the product');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <FormInput label="Title" name="title" type="text" value={form.title} onChange={handleChange} required />
          <FormInput label="Name" name="name" type="text" value={form.name} onChange={handleChange} required />
          
          <div>
            <Label className="mb-1 block font-semibold">Description</Label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md resize-none focus:outline-amber-500"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Price (৳)" name="price" type="text" value={form.price} onChange={handleChange} required />
            <FormInput label="Discount (%)" name="discount" type="text" value={form.discount} onChange={handleChange} />
          </div>

          <FormInput label="Stock" name="stock" type="text" value={form.stock} onChange={handleChange} required />

          {/* Sizes */}
          <div>
            <Label className="mb-1 block font-semibold">Product Sizes</Label>
            {form.sizes.map((size, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input type="text" placeholder="Size Label" value={size.label} onChange={e => handleSizeChange(index, 'label', e.target.value)} className="px-3 py-2 border rounded-md w-1/2" required />
                <input type="text" placeholder="Price" value={size.price} onChange={e => handleSizeChange(index, 'price', e.target.value)} className="px-3 py-2 border rounded-md w-1/2" required />
                <Button type="button" variant="destructive" onClick={() => handleRemoveSize(index)}>Remove</Button>
              </div>
            ))}
            <Button className='text-black bg-amber-400 hover:text-black' type="button" onClick={handleAddSize}>Add Size</Button>
          </div>

          {/* Images */}
          <div>
            <Label className="mb-1 block font-semibold">Upload Images</Label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-md cursor-pointer" />
          </div>

          {/* Service / Category / Subcategory */}
          <div>
            <Label className="mb-1 block font-semibold">Select Service</Label>
            <Select onValueChange={val => handleSelect('serviceId', val)} value={form.serviceId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose service" /></SelectTrigger>
              <SelectContent>{serviceData?.data?.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Select Category</Label>
            <Select onValueChange={val => handleSelect('categoryId', val)} value={form.categoryId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose category" /></SelectTrigger>
              <SelectContent>{categoryData?.data?.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Select Subcategory</Label>
            <Select onValueChange={val => handleSelect('subCategoryId', val)} value={form.subCategoryId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose subcategory" /></SelectTrigger>
              <SelectContent>{subCategoryData?.data?.map(sub => <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {/* Publish */}
          <div className="flex items-center gap-3">
            <Label className="font-semibold">Publish</Label>
            <Switch checked={form.isPublished} onCheckedChange={val => setForm({ ...form, isPublished: val })} />
          </div>

          <DialogFooter>
            <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Update Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
