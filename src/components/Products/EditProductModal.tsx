
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

// Types
interface IProductSize {
  label: string;
  price:number;
}

interface IProduct {
  _id: string;
  title: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock: boolean;
  serviceId: string | { _id: string };
  categoryId: string | { _id: string };
  subCategoryId: string | { _id: string };
  isPublished: boolean;
  sizes?: IProductSize[];
}

interface IService { _id: string; name: string }
interface ICategory { _id: string; name: string }
interface ISubCategory { _id: string; name: string }

interface IEditProductModalProps {
  product: IProduct | null;
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
    stock: true,
    serviceId: '',
    categoryId: '',
    subCategoryId: '',
    isPublished: false,
    sizes: [] as IProductSize[],
  });

  const [files, setFiles] = useState<File[]>([]);

  // Normalize id fields
  const normalizeId = (field: string | { _id: string }) =>
    typeof field === 'string' ? field : field._id;

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discount: product.discount?.toString() || '',
        stock: product.stock,
        serviceId: normalizeId(product.serviceId),
        categoryId: normalizeId(product.categoryId),
        subCategoryId: normalizeId(product.subCategoryId),
        isPublished: product.isPublished,
        sizes: product.sizes?.map(s => ({ label: s.label, price: s.price })) || [],
      });
    }
  }, [product]);

  const banglaToEnglish = (str: string) => {
    if (!str) return '';
    const map: Record<string, string> = { '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9' };
    return str.replace(/[০-৯]/g, (d) => map[d]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (['price', 'discount'].includes(e.target.name)) {
      value = value.replace(/[^0-9০-৯.]/g, '');
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSelect = (field: 'serviceId' | 'categoryId' | 'subCategoryId', value: string) =>
    setForm({ ...form, [field]: value });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleAddSize = () => setForm({ ...form, sizes: [...form.sizes, { label: '', price: 0 }] });
  const handleRemoveSize = (index: number) =>
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) });
  
const handleSizeChange = (index: number, field: 'label' | 'price', value: string) => {
  const updatedSizes = [...form.sizes];

  updatedSizes[index] = {
    ...updatedSizes[index],
    [field]: field === 'price' ? Number(value) : value
  };

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
      stock: form.stock,
      serviceId: form.serviceId,
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      sizes: form.sizes.map(s => ({ label: s.label, price: (s.price) || 0 })),
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    files.forEach(file => formData.append('file', file));

    try {
      await updateProduct({ id: product!._id, formData }).unwrap();
      toast.success('Product updated successfully!');
      onClose();
      router.refresh();
    } catch {
  toast.error('Something went wrong while updating the product');
}
  }

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

          <div className="flex items-center gap-3">
            <Label className="font-semibold">In Stock</Label>
            <Switch checked={form.stock} onCheckedChange={(val) => setForm({ ...form, stock: val })} />
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Product Sizes</Label>
            {form.sizes.map((size, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Size Label"
                  value={size.label}
                  onChange={e => handleSizeChange(index, 'label', e.target.value)}
                  className="px-3 py-2 border rounded-md w-1/2"
                  required
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={size.price}
                  onChange={e => handleSizeChange(index, 'price', e.target.value)}
                  className="px-3 py-2 border rounded-md w-1/2"
                  required
                />
                <Button type="button" variant="destructive" onClick={() => handleRemoveSize(index)}>Remove</Button>
              </div>
            ))}
            <Button className='text-black bg-amber-400 hover:text-black' type="button" onClick={handleAddSize}>Add Size</Button>
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Upload Images</Label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md cursor-pointer"
            />
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Select Service</Label>
            <Select onValueChange={val => handleSelect('serviceId', val)} value={form.serviceId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose service" /></SelectTrigger>
              <SelectContent>
                {serviceData?.data?.map((s: IService) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Select Category</Label>
            <Select onValueChange={val => handleSelect('categoryId', val)} value={form.categoryId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose category" /></SelectTrigger>
              <SelectContent>
                {categoryData?.data?.map((c: ICategory) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 block font-semibold">Select Subcategory</Label>
            <Select onValueChange={val => handleSelect('subCategoryId', val)} value={form.subCategoryId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose subcategory" /></SelectTrigger>
              <SelectContent>
                {subCategoryData?.data?.map((sub: ISubCategory) => <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

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
