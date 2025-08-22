'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { FormInput } from '@/components/form/FromInput';
import { Button } from '@/components/ui/button';
import { useGetAllCartsQuery } from '@/redux/features/AddToCart/addToCartApi';
import { useAddOrderMutation } from '@/redux/features/Order/ordersApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type ShippingAddress = {
  fullName: string;
  phone: string;
  fullAddress: string;
};

type ValidationErrors = Partial<Record<keyof ShippingAddress, string>>;

type Item = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  discount?: number;
  size?: { label: string; price: number };
};

export default function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    fullAddress: '',
  });

  const [siteNote, setSiteNote] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [backendError, setBackendError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'sslCommerz'>('cash_on_delivery');
  const [sslCommerzWarning, setSslCommerzWarning] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'insideRangpur' | 'outsideRangpur'>('insideRangpur');

  const { data } = useGetAllCartsQuery({});
  const router = useRouter();
  const [addOrder] = useAddOrderMutation();

  const cartItems: Item[] = data?.data?.items?.map((item) => ({
    _id: item.productId,
    name: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image || item.productId?.image || '',
    discount: item.discount,
    selectedSize: item.selectedSize,
  })) ?? [];

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Calculate discount
  const discountAmount = cartItems.reduce((acc, item) => {
    if (item.discount && item.discount > 0) {
      return acc + (item.price * item.quantity * item.discount) / 100;
    }
    return acc;
  }, 0);

  const shippingCost = deliveryOption === 'insideRangpur' ? 0 : 0;
  const grandTotal = subtotal - discountAmount + shippingCost;

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
    setPaymentMethod(selectedMethod);
    setSslCommerzWarning(false);
  };

  const handleDeliveryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value as 'insideRangpur' | 'outsideRangpur');
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!shippingAddress.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!shippingAddress.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\+?\d{7,15}$/.test(shippingAddress.phone.trim())) errors.phone = 'Enter a valid phone number';
    if (!shippingAddress.fullAddress.trim()) errors.fullAddress = 'Full Address is required';
    else if (shippingAddress.fullAddress.trim().length < 6) errors.fullAddress = 'Address must be at least 6 characters';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        subtotal,
        discountAmount,
        shippingCost,
        grandTotal,
      };

      await addOrder(orderPayload).unwrap();
      toast.success('Order placed successfully!');
      router.push('/order');
    } catch (error) {
  // Type-safe error handling
  const err = error as { data?: { message?: string } } | undefined;
  const msg = err?.data?.message || 'Failed to place order. Please try again.';
  setBackendError(msg);
  toast.error(msg);
}
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto mb-9">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8" noValidate>
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          {backendError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-400">
              {backendError}
            </div>
          )}

          <section className="rounded-lg p-6 space-y-6 border border-amber-300 bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Shipping Address</h2>

            <FormInput type="text" label="Full Name" name="fullName" value={shippingAddress.fullName} onChange={handleChange} error={validationErrors.fullName} />
            <FormInput type="tel" label="Phone" name="phone" value={shippingAddress.phone} onChange={handleChange} error={validationErrors.phone} />
            <FormInput type="text" label="Full Address" name="fullAddress" value={shippingAddress.fullAddress} onChange={handleChange} error={validationErrors.fullAddress} />
          </section>

          <FormInput type="text" label="Site Note (Optional)" name="siteNote" value={siteNote} onChange={handleChange} />

          {/* Delivery Option */}
          <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <label className="block text-lg font-semibold mb-4">Delivery Option</label>
            <div className="flex flex-col gap-3">
              {['insideRangpur', 'outsideRangpur'].map((option) => (
                <label key={option} className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between ${deliveryOption === option ? 'border-amber-600 bg-amber-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                  <span>{option === 'insideRangpur' ? 'Inside Rangpur (Free)' : 'Outside Rangpur (Free)'}</span>
                  <input type="radio" name="deliveryOption" value={option} checked={deliveryOption === option} onChange={handleDeliveryChange} className="hidden" />
                  <span className={`w-5 h-5 rounded-full border-2 ${deliveryOption === option ? 'border-amber-600 bg-amber-600' : 'border-gray-300'}`} />
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
                  <label key={value} className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between flex-1 ${isSelected ? 'border-amber-600 bg-amber-50' : 'border-gray-300 bg-white hover:bg-gray-50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span>{label}</span>
                    <input type="radio" name="paymentMethod" value={value} checked={isSelected} onChange={handlePaymentChange} disabled={disabled} className="hidden" />
                    <span className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-amber-600 bg-amber-600' : 'border-gray-300'}`} />
                  </label>
                );
              })}
            </div>
            {sslCommerzWarning && <p className="mt-2 text-sm text-red-600 font-semibold">SSLCommerz not ready yet...</p>}
          </section>
        </div>

        {/* Right */}
        <aside className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-200">
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-gray-700">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <Image width={40} height={40} src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                      <div>
                        <p>{item.name} × {item.quantity}</p>
                        {item.size && <p className="text-sm text-gray-500">Size: {item.size.label}</p>}
                        {item.discount && <p className="text-sm text-red-600 font-semibold">{item.discount}% OFF</p>}
                      </div>
                    </div>
                    <span>৳ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <hr className="my-4 border-gray-300" />
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Subtotal</span>
                  <span>৳ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Discount</span>
                  <span className="text-red-600">-৳ {discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>৳ {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-3 text-gray-900">
                  <span>Grand Total</span>
                  <span>৳ {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          <Button type="submit" variant="secondary" className="w-full mt-4">Confirm Order</Button>
        </aside>
      </form>
    </div>
  );
}
