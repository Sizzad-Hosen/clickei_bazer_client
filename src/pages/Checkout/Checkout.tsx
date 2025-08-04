'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { FormInput } from '@/components/form/FromInput';
import { Button } from '@/components/ui/button';

type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cashOnDelivery' | 'sslCommerz'>('cashOnDelivery');

  // Delivery option state
  type DeliveryOption = 'insideRangpur' | 'outsideRangpur';
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('insideRangpur');

  // Dummy cart data
  const cartItems = [
    { _id: '1', name: 'Rice 5kg', price: 300, quantity: 1 },
    { _id: '2', name: 'Oil 1L', price: 180, quantity: 2 },
    { _id: '3', name: 'Dal 1kg', price: 120, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Shipping cost based on delivery option
  const shippingCost = deliveryOption === 'insideRangpur' ? 50 : 0;

  const grandTotal = subtotal + shippingCost;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as 'cashOnDelivery' | 'sslCommerz');
  };

  const handleDeliveryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value as DeliveryOption);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ shippingAddress, paymentMethod, deliveryOption, cartItems });
    alert('Order placed successfully (front-end only)');
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mb-9 mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section: Shipping Address, Delivery Option & Payment Method */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <section className="rounded-lg p-6 space-y-6 border border-gray-200 bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Shipping Address</h2>
            <FormInput
              type="text"
              label="Full Name"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleChange}
              required
            />
            <FormInput
              type="tel"
              label="Phone"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleChange}
              required
            />
            <FormInput
              type="text"
              label="Address"
              name="address"
              value={shippingAddress.address}
              onChange={handleChange}
              required
            />
            <FormInput
              type="text"
              label="City"
              name="city"
              value={shippingAddress.city}
              onChange={handleChange}
              required
            />
            <FormInput
              type="text"
              label="Postal Code"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleChange}
              required
            />
            <FormInput
              type="text"
              label="Country"
              name="country"
              value={shippingAddress.country}
              onChange={handleChange}
              required
            />
          </section>

          {/* Delivery Option Card */}
          <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <label className="block text-lg font-semibold mb-4">Select Delivery Option</label>

            <div className="flex flex-col gap-3">
              <label
                className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between
                  ${
                    deliveryOption === 'insideRangpur'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
              >
                <span>Inside Rangpur (Free)</span>
                <input
                  type="radio"
                  name="deliveryOption"
                  value="insideRangpur"
                  checked={deliveryOption === 'insideRangpur'}
                  onChange={handleDeliveryChange}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0
                    ${
                      deliveryOption === 'insideRangpur'
                        ? 'border-amber-600 bg-amber-600'
                        : 'border-gray-300'
                    }`}
                />
              </label>

              <label
                className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between
                  ${
                    deliveryOption === 'outsideRangpur'
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
              >
                <span>Outside Rangpur (Free)</span>
                <input
                  type="radio"
                  name="deliveryOption"
                  value="outsideRangpur"
                  checked={deliveryOption === 'outsideRangpur'}
                  onChange={handleDeliveryChange}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0
                    ${
                      deliveryOption === 'outsideRangpur'
                        ? 'border-amber-600 bg-amber-600'
                        : 'border-gray-300'
                    }`}
                />
              </label>
            </div>
          </section>

          {/* Payment Method Card */}
          <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <label className="block text-lg font-semibold mb-4">Payment Method</label>

            <div className="flex flex-row gap-4">
              {['cashOnDelivery', 'sslCommerz'].map((method) => {
                const isSelected = paymentMethod === method;
                const labelText = method === 'cashOnDelivery' ? 'Cash on Delivery' : 'SSLCommerz';
                return (
                  <label
                    key={method}
                    className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between flex-1
                      ${isSelected ? 'border-amber-600 bg-amber-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                  >
                    <span>{labelText}</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={isSelected}
                      onChange={handlePaymentChange}
                      className="hidden"
                      aria-checked={isSelected}
                    />
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0
                        ${isSelected ? 'border-amber-600 bg-amber-600' : 'border-gray-300'}`}
                    />
                  </label>
                );
              })}
            </div>
          </section>
        </form>

        {/* Right Section: Order Summary & Submit Button */}
        <aside className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-200">
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-700">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>৳ {item.price * item.quantity}</span>
                  </div>
                ))}

                <hr className="my-4 border-gray-300" />

                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Subtotal</span>
                  <span>৳ {subtotal}</span>
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

          <Button
            type="submit"
            onClick={handleSubmit}
            variant={"secondary"}
          >
            Place Order
          </Button>
          
        </aside>
      </div>
    </div>
  );
}
