import { Product } from '@/types/products';
import { useDispatch } from 'react-redux';


export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();

  return (
    <div className="border rounded shadow p-4 hover:shadow-lg transition">
      <div className="h-32 bg-gray-200 rounded mb-3" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">${product.price}</p>
      <button
       
        className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
