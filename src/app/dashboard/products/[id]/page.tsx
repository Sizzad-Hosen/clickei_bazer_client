'use client';

import React, { useState } from 'react';
import { useDeleteProductMutation, useGetSingleProductQuery } from '@/redux/features/Products/productApi';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { MdDelete, MdEdit } from 'react-icons/md';
import Swal from 'sweetalert2';
import Spinner from '@/components/Spinner';
import EditProductModal from '@/components/Products/EditProductModal';

const ProductDetailsPage = () => {
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';

  const router = useRouter();

  const { data: product, isLoading, isError } = useGetSingleProductQuery(id);

  const productExists = product;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  if (isLoading) return <Spinner />;

  if (isError || !productExists) {
    return (
      <p className="text-center text-red-600 py-20 font-semibold">
        Failed to load product.
      </p>
    );
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully!');
        router.push('/dashboard/products');
      } catch {
        toast.error('Failed to delete product.');
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">{productExists.name}</h1>

      <section className="mb-8">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {productExists.images?.length ? (
            productExists.images.map((img: string, i: number) => (
              <div
                key={i}
                className="relative w-56 h-56 rounded-lg overflow-hidden flex-shrink-0 shadow-md hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={img}
                  alt={`${productExists.name} image ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="w-56 h-56 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 font-medium">
              No Images
            </div>
          )}
        </div>
      </section>

      <section className="mb-8 space-y-3 text-gray-800">
        <p>
          <span className="font-semibold">Title:</span> {productExists.title}
        </p>
        <p>
          <span className="font-semibold">Description:</span> {productExists.description}
        </p>
        <p>
          <span className="font-semibold">Price:</span>{' '}
          <span className="text-green-600 font-semibold">৳ {productExists.price}</span>
        </p>
        <p>
          <span className="font-semibold">Stock:</span> {productExists.stock || 'N/A'}
        </p>
        <div>
          <span className="font-semibold">Sizes:</span>
          {productExists.sizes.length > 0 ? (
            <ul className="ml-4 list-disc">
              {productExists.sizes.map((s, idx) => (
                <li key={idx}>
                  {s.label} - ৳ {s.price}  
                </li>
              ))}
            </ul>
          ) : (
            ' N/A'
          )}
        </div>

        <p>
          <span className="font-semibold">Published:</span>{' '}
          <span
            className={
              productExists.isPublished
                ? 'text-green-600 font-semibold'
                : 'text-red-600 font-semibold'
            }
          >
            {productExists.isPublished ? 'Yes' : 'No'}
          </span>
        </p>
      </section>

      <section className="flex gap-4">
        <Button
          onClick={() => setIsEditOpen(true)}
          aria-label="Edit product"
          className="px-6 py-2 flex items-center gap-2"
        >
          <MdEdit size={20} />
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDelete(id)}
          disabled={isDeleting}
          aria-label="Delete product"
          className="px-6 py-2 flex items-center gap-2"
        >
          <MdDelete size={20} />
        </Button>
      </section>

      <EditProductModal
        product={productExists}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </main>
  );
};

export default ProductDetailsPage;
