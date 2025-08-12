'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { FormInput } from '@/components/form/FromInput';
import { Button } from '@/components/ui/button';
import { useGetAllCartsQuery } from '@/redux/features/AddToCart/addToCartApi';
import { useAddOrderMutation } from '@/redux/features/Order/ordersApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlices';
import Image from 'next/image';
import { Product } from '@/types/products';

type ShippingAddress = {
  fullName: string;
  phone: string;
  fullAddress: string;
};

type ValidationErrors = Partial<Record<keyof ShippingAddress, string>>;

export default function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    fullAddress: '',
  });

  const [siteNote, setSiteNote] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [backendError, setBackendError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'sslCommerz'>('cash_on_delivery');
  const [sslCommerzWarning, setSslCommerzWarning] = useState(false);

  const { data } = useGetAllCartsQuery({});

  const user = useAppSelector(selectCurrentUser)

  console.log("user", user)

  type DeliveryOption = 'insideRangpur' | 'outsideRangpur';
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('insideRangpur');
  
  type Item = {
  _id: string;
  name: string;
  price: number | string; // price can be string or number, convert later if needed
  image?: string;
  quantity: number;
};

// Example data shape, you can adjust if you have nested productId:
type RawItem = {
  productId: {
    _id: string;
    image?: string;
  };
  title: string;
  price: number | string;
  image?: string;
  quantity: number;
};

// Assuming data?.data?.items is RawItem[]
const cartItems: Item[] =
  data?.data?.items?.map((item: RawItem) => ({
    _id: item.productId._id,
    name: item.title,
    price: item.price,
    image: item.image || item.productId.image || '',
    quantity: item.quantity,
  })) ?? [
    { _id: '1', name: 'Rice 5kg', price: 300, quantity: 1, image: '' },
    { _id: '2', name: 'Oil 1L', price: 180, quantity: 2, image: '' },
    { _id: '3', name: 'Dal 1kg', price: 120, quantity: 1, image: '' },
  ];

  console.log("cart Item", cartItems)

const subtotal = cartItems.reduce((acc, item) => {
  const priceNum = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
  return acc + priceNum * item.quantity;
}, 0);


  const subtotalFixed = Number(subtotal.toFixed(2));
  const shippingCost = deliveryOption === 'insideRangpur' ? 0 : 0;
  const grandTotal = +(subtotalFixed + shippingCost).toFixed(2);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'siteNote') {
      setSiteNote(value);
      return;
    }

    setShippingAddress((prev) => ({ ...prev, [name]: value }));

    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    setBackendError(null);
  };

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedMethod = e.target.value as 'cash_on_delivery' | 'sslCommerz';
    if (selectedMethod === 'sslCommerz') {
      setSslCommerzWarning(true);
      return;
    }
    setSslCommerzWarning(false);
    setPaymentMethod(selectedMethod);
  };

  const handleDeliveryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value as DeliveryOption);
  };

  const [addOrder] = useAddOrderMutation();
  const router = useRouter();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (shippingAddress.fullName.trim().length < 3) {
      errors.fullName = 'Full Name must be at least 3 characters';
    }

    if (!shippingAddress.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\+?\d{7,15}$/.test(shippingAddress.phone.trim())) {
      errors.phone = 'Enter a valid phone number';
    }

    if (!shippingAddress.fullAddress.trim()) {
      errors.fullAddress = 'Full Address is required';
    } else if (shippingAddress.fullAddress.trim().length < 6) {
      errors.fullAddress = 'Address must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    try {
      const orderPayload = {
        paymentMethod,
        address: shippingAddress,
        deliveryOption,
        siteNote,
        cartItems,
      };

      const res = await addOrder(orderPayload).unwrap();
      
      console.log("res", res)

      toast.success('Order placed successfully!');

      setShippingAddress({ fullName: '', phone: '', fullAddress: '' });
      setSiteNote('');
      setPaymentMethod('cash_on_delivery');
      setDeliveryOption('insideRangpur');
      setSslCommerzWarning(false);
      setValidationErrors({});

      router.push('/order');
    } catch (error: any) {
      if (error?.data?.message) {
        setBackendError(error.data.message);
      } else if (error?.status === 401) {
        setBackendError('Unauthorized access. Please login again.');
      } else {
        setBackendError('Failed to place order. Please try again.');
      }
      toast.error(backendError ?? 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mb-9 mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8" noValidate>
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Backend error */}
          {backendError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-400">
              {backendError}
            </div>
          )}

          {/* Shipping Address */}
          <section className="rounded-lg p-6 space-y-6 border border-amber-300 bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Shipping Address</h2>

            <FormInput
              type="text"
              label="Full Name"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleChange}
              required
              error={validationErrors.fullName}
            />
            {validationErrors.fullName && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.fullName}</p>
            )}

            <FormInput
              type="tel"
              label="Phone"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleChange}
              required
              error={validationErrors.phone}
            />
            {validationErrors.phone && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
            )}

            <FormInput
              type="text"
              label="Full Address"
              name="fullAddress"
              value={shippingAddress.fullAddress}
              onChange={handleChange}
              required
              error={validationErrors.fullAddress}
            />
            {validationErrors.fullAddress && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.fullAddress}</p>
            )}
          </section>

          {/* Site Note (optional) */}
          <FormInput
            type="text"
            label="Site Note (Optional)"
            name="siteNote"
            value={siteNote}
            onChange={handleChange}
          />

          {/* Delivery Option */}
          <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <label className="block text-lg font-semibold mb-4">Select Delivery Option</label>

            <div className="flex flex-col gap-3">
              {['insideRangpur', 'outsideRangpur'].map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between ${
                    deliveryOption === option
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span>
                    {option === 'insideRangpur' ? 'Inside Rangpur (Free)' : 'Outside Rangpur (Free)'}
                  </span>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value={option}
                    checked={deliveryOption === option}
                    onChange={handleDeliveryChange}
                    className="hidden"
                  />
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                      deliveryOption === option ? 'border-amber-600 bg-amber-600' : 'border-gray-300'
                    }`}
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <label className="block text-lg font-semibold mb-4">Payment Method</label>

            <div className="flex flex-row gap-4">
              {[
                { value: 'cash_on_delivery', label: 'Cash on Delivery', disabled: false },
                { value: 'sslCommerz', label: 'SSLCommerz (Coming Soon)', disabled: true },
              ].map(({ value, label, disabled }) => {
                const isSelected = paymentMethod === value;
                return (
                  <label
                    key={value}
                    className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between flex-1 ${
                      isSelected ? 'border-amber-600 bg-amber-50' : 'border-gray-300 bg-white hover:bg-gray-50'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>{label}</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={isSelected}
                      onChange={handlePaymentChange}
                      disabled={disabled}
                      className="hidden"
                      aria-checked={isSelected}
                    />
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                        isSelected ? 'border-amber-600 bg-amber-600' : 'border-gray-300'
                      }`}
                    />
                  </label>
                );
              })}
            </div>

            {sslCommerzWarning && (
              <p className="mt-2 text-sm text-red-600 font-semibold">
                Working system now not ready, coming soon adding this feature...
              </p>
            )}
          </section>
        </div>

        {/* Right Section */}
        <aside className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-200">
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-700">

                   {item.image ? (
                <Image
                  width={40}
                  height={40}
                  src={item.image}
                  alt={item.name || ""}
                  className="w-12 h-12 object-cover rounded mr-3 border"
                />
              ) : (
                // Optionally render a placeholder image or nothing if no image available
                <div className="w-12 h-12 bg-gray-200 rounded mr-3 border flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              )}

                                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>৳ {item.price * item.quantity}</span>
                  </div>
                ))}

                <hr className="my-4 border-gray-300" />

                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Subtotal</span>
                  <span>৳ {subtotalFixed}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>৳ {shippingCost}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-3 text-gray-900">
                  <span>Grand Total</span>
                  <span>৳ {grandTotal}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Button BELOW the order summary */}
          <Button type="submit" variant="secondary" className="w-full mt-4">
            Confirm Order
          </Button>
        </aside>

      </form>
    </div>
  );
}
