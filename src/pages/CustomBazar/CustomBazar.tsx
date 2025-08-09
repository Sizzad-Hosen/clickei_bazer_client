'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  useAddCustomBazarOrderMutation,
  useGetAllCustomBazarProductsQuery,
} from '@/redux/features/CustomBazar/customBazarApi';
import Spinner from '@/components/Spinner';
import { toast } from 'sonner';

interface Subcategory {
  _id: string;
  name: string;
  pricePerUnit: number;
  units?: string[];
  unit?: string;
}

interface Category {
  _id: string;
  category: string;
  subcategories: Subcategory[];
}

interface Selection {
  selectedSub?: Subcategory; // can be undefined when nothing selected
  quantity: number;
  unit: string;
}

interface Address {
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
}

const CustomBazarPage: React.FC = () => {
  const { data, isLoading, isError } = useGetAllCustomBazarProductsQuery();
  const [addCustomBazarOrder, { isLoading: isSubmitting }] = useAddCustomBazarOrderMutation();

  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phoneNumber: '',
    fullAddress: '',
  });
  const [siteNote, setSiteNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'sslcommerz'>('cash_on_delivery');
  const [sslCommerzWarning, setSslCommerzWarning] = useState(false);

  const [deliveryOption, setDeliveryOption] = useState<'insideRangpur' | 'outsideRangpur'>('insideRangpur');

  const categories: Category[] = data?.data || [];

  // Initialize selections when data loads - start with no selection (empty)
  useEffect(() => {
    if (!categories.length) return;

    const initialSelections: Record<string, Selection> = {};
    categories.forEach(cat => {
      initialSelections[cat._id] = {
        selectedSub: undefined,
        quantity: 0,
        unit: '',
      };
    });
    setSelections(initialSelections);
  }, [categories]);

  if (isLoading) return <Spinner />;
  if (isError) return <p className="text-red-500">Failed to load products.</p>;

  const handleSubcategoryChange = (categoryId: string, subName: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    const sub = category?.subcategories.find(s => s.name === subName);

    setSelections(prev => ({
      ...prev,
      [categoryId]: sub
        ? {
            selectedSub: sub,
            quantity: 1,
            unit: sub.units?.[0] || sub.unit || '',
          }
        : {
            selectedSub: undefined,
            quantity: 0,
            unit: '',
          },
    }));
  };

  const handleQuantityChange = (categoryId: string, delta: number) => {
    setSelections(prev => {
      const current = prev[categoryId];
      if (!current || !current.selectedSub) return prev; // can't change quantity if no sub selected

      const newQty = Math.max(1, (current.quantity || 1) + delta);
      return {
        ...prev,
        [categoryId]: {
          ...current,
          quantity: newQty,
        },
      };
    });
  };

  const handleUnitChange = (categoryId: string, unit: string) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        unit,
      },
    }));
  };

  const getTotalPrice = (): number => {
    return Object.values(selections).reduce((acc, item) => {
      if (!item.selectedSub) return acc;
      return acc + item.selectedSub.pricePerUnit * (item.quantity || 0);
    }, 0);
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value as 'cash_on_delivery' | 'sslcommerz';
    if (val === 'sslcommerz') {
      setSslCommerzWarning(true);
      // do NOT set payment method to sslcommerz because it’s not ready yet
      return;
    }
    setSslCommerzWarning(false);
    setPaymentMethod(val);
  };

  const handleDeliveryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value as 'insideRangpur' | 'outsideRangpur');
  };

  const resetForm = () => {
    const initialSelections: Record<string, Selection> = {};
    categories.forEach(cat => {
      initialSelections[cat._id] = {
        selectedSub: undefined,
        quantity: 0,
        unit: '',
      };
    });
    setSelections(initialSelections);

    setAddress({
      fullName: '',
      phoneNumber: '',
      fullAddress: '',
    });

    setSiteNote('');
    setPaymentMethod('cash_on_delivery');
    setSslCommerzWarning(false);
    setDeliveryOption('insideRangpur');
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!address.fullName || !address.phoneNumber || !address.fullAddress) {
      toast.error('দয়া করে সকল ঠিকানা তথ্য পূরণ করুন।');
      return;
    }

    // Filter only selections with selected subcategory and quantity > 0
    const orderItems = Object.entries(selections)
      .filter(([, sel]) => sel.selectedSub && sel.quantity > 0)
      .map(([catId, sel]) => ({
        product: catId,
        subcategoryName: sel.selectedSub!.name,
        unit: sel.unit,
        pricePerUnit: sel.selectedSub!.pricePerUnit,
        quantity: sel.quantity,
        totalPrice: sel.selectedSub!.pricePerUnit * sel.quantity,
      }));

    if (orderItems.length === 0) {
      toast.error('দয়া করে অন্তত একটি পণ্য নির্বাচন করুন।');
      return;
    }

    const payload = {
      orderItems,
      status: 'pending',
      paymentMethod,
      deliveryOption,
      address,
      siteNote,
    };

    try {
      await addCustomBazarOrder(payload).unwrap();

      toast.success('✅ অর্ডার সফলভাবে সাবমিট হয়েছে!');
      resetForm();
    } catch (error) {
      console.error('❌ অর্ডার সাবমিট করতে সমস্যা হয়েছে:', error);
      toast.error('❌ অর্ডার সাবমিট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 কাস্টম বাজার অর্ডার</h2>

      <form onSubmit={handleSubmitOrder} className="space-y-6">
        {/* Product Selection */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {categories.map(category => {
            const selection = selections[category._id];
            const selected = selection?.selectedSub;

            return (
              <div
                key={category._id}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 items-center gap-3 border p-4 rounded-lg shadow-sm bg-white"
              >
                {/* Category Name */}
                <div className="md:col-span-2 font-semibold text-gray-700 truncate">
                  {category.category}
                </div>

                {/* Subcategory Dropdown */}
                <div className="md:col-span-3">
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={selection?.selectedSub?.name || ''}
                    onChange={e => handleSubcategoryChange(category._id, e.target.value)}
                  >
                    <option value="">Select Subcategory</option>
                    {category.subcategories.map(sub => (
                      <option key={sub._id} value={sub.name}>
                        {sub.name} - {sub.pricePerUnit}৳
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Dropdown */}
                <div className="md:col-span-1">
                  {selected && (
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={selection.unit}
                      onChange={e => handleUnitChange(category._id, e.target.value)}
                    >
                      {(selected.units || [selected.unit || '']).map(unit => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="md:col-span-4 flex items-center flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(category._id, -1)}
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={!selected || selection?.quantity === 1}
                  >
                    −
                  </button>

                  <span className="px-3 py-1 text-lg font-semibold border rounded select-none">
                    {selection?.quantity || 0}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(category._id, 1)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    disabled={!selected}
                  >
                    +
                  </button>

                  <span className="text-sm text-gray-700">{selection?.unit}</span>
                </div>

                {/* Total Price */}
                <div className="md:col-span-2 text-right font-bold text-blue-700 text-lg w-full md:w-auto">
                  {selected ? selection.quantity * selected.pricePerUnit : 0}৳
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery Option */}
        <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold mb-2">ডেলিভারি অপশন</h3>
          
          <div className="flex flex-col gap-3 w-full ">
            {['insideRangpur', 'outsideRangpur'].map(option => (
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

        {/* Address Section */}
        <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold mb-2">ডেলিভারি ঠিকানা</h3>

          <input
            type="text"
            name="fullName"
            placeholder="পুরো নাম"
            value={address.fullName}
            onChange={handleAddressChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="ফোন নাম্বার"
            value={address.phoneNumber}
            onChange={handleAddressChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="fullAddress"
            placeholder="পুরো ঠিকানা"
            value={address.fullAddress}
            onChange={handleAddressChange}
            required
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </section>

        {/* Site Note */}
        <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <label htmlFor="siteNote" className="block mb-2 font-semibold">
            আপনার জন্য বিশেষ অনুরোধ (ঐচ্ছিক)
          </label>
          <textarea
            id="siteNote"
            name="siteNote"
            placeholder="অনুরোধ লিখুন..."
            value={siteNote}
            onChange={e => setSiteNote(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-3">
          <h3 className="text-lg font-semibold mb-4">পেমেন্ট পদ্ধতি</h3>
          <div className="flex gap-4 max-w-sm">
            <label
              className={`cursor-pointer border rounded-lg p-4 flex-1 text-center ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={handlePaymentChange}
                className="hidden"
              />
              Cash on Delivery
            </label>

            <label
              className={`cursor-pointer border rounded-lg p-4 flex-1 text-center opacity-50 cursor-not-allowed ${
                paymentMethod === 'sslcommerz'
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-gray-300 bg-white'
              }`}
              onClick={() => setSslCommerzWarning(true)}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="sslcommerz"
                checked={paymentMethod === 'sslcommerz'}
                onChange={handlePaymentChange}
                className="hidden"
                disabled
              />
              SSLCommerz
            </label>
          </div>

          {sslCommerzWarning && (
            <p className="mt-2 text-sm text-red-600 font-semibold">
              ⚠️ কাজ চলছে, শীঘ্রই আসছে...
            </p>
          )}
        </section>

        {/* Order Summary and Submit */}
        <div className="mt-6 border-t pt-4 flex flex-col items-end">
          <div className="text-xl font-bold text-gray-800">
            মোট অর্ডার মূল্য: <span className="text-green-600">{getTotalPrice()}৳</span>
          </div>
          <button
            type="submit"
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'অর্ডার সাবমিট করা হচ্ছে...' : 'অর্ডার সাবমিট করুন'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomBazarPage;
