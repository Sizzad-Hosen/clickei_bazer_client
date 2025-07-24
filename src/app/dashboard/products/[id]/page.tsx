'use client';

import React from 'react';
import { useDeleteProductMutation, useGetSingleProductQuery } from '@/redux/features/Products/productApi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface Props {
  params: Promise<{ id: string }>;
}

const ProductDetailsPage = ({ params }: Props) => {
  const unwrappedParams = React.use(params); // unwrap Promise here
  const { id } = unwrappedParams;

  const router = useRouter();

  const { data: product, isLoading, isError } = useGetSingleProductQuery(id);

  const productExists = product?.data
  
  console.log('Product Details:', product);

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  if (isLoading) return <p className="text-center">Loading product...</p>;
  if (isError || !product) return <p className="text-center text-red-500">Failed to load product.</p>;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully!');
      router.push('/dashboard/products');
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{productExists.name}</h1>

      <div className="mb-6 flex gap-4 overflow-x-auto">
        {productExists.images?.length > 0 ? (
          productExists.images.map((img: string, i: number) => (
            <div key={i} className="relative w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={img} alt={`${productExists.name} image ${i + 1}`} fill className="object-cover" />
            </div>
          ))
        ) : (
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg">No Images</div>
        )}
      </div>

      <p className="mb-2"><strong>Title:</strong> {productExists.title}</p>
      <p className="mb-2"><strong>Description:</strong> {productExists.description}</p>
      <p className="mb-2"><strong>Price:</strong> ৳ {productExists.price}</p>
      <p className="mb-2"><strong>Quantity:</strong> {productExists.quantity}</p>
      <p className="mb-4"><strong>Published:</strong> {productExists.isPublished ? 'Yes' : 'No'}</p>

      <div className="flex gap-4">
        <Link href={`/dashboard/products/edit/${productExists._id}`}>
          <Button>Edit</Button>
        </Link>

        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
