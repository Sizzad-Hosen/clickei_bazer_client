'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, useMemo } from 'react';
import {
  useAddCustomBazarOrderMutation,
  useGetAllCustomBazarProductsQuery,
} from '@/redux/features/CustomBazar/customBazarApi';
import Spinner from '@/components/Spinner';
import { toast } from 'sonner';
import {
  Category,
  Selection,
  TCustomBazerOrder,
  TCustomBazerOrderItem,
  UnitType,
} from '@/types/CustomBazar';
import { TAddress } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentToken } from '@/redux/features/auth/authSlices';

const CustomBazarPage: React.FC = () => {
  const [addCustomBazarOrder, { isLoading: isSubmitting }] =
    useAddCustomBazarOrderMutation();

  const { data, isLoading, isError } = useGetAllCustomBazarProductsQuery();

  const categories: Category[] = useMemo(() => data?.data ?? [], [data]);

  const [selections, setSelections] = useState<Record<string, Selection[]>>({});


  const router = useRouter();

  const [address, setAddress] = useState<TAddress>({
    fullName: '',
    phoneNumber: '',
    fullAddress: '',
  });

  const [siteNote, setSiteNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'sslcommerz'>(
    'cash_on_delivery'
  );
  const [sslCommerzWarning, setSslCommerzWarning] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'insideRangpur' | 'outsideRangpur'>(
    'insideRangpur'
  );

  const token = useAppSelector(selectCurrentToken)

  // Initialize selections when categories load
  useEffect(() => {
    if (!categories.length) return;

    const initialSelections: Record<string, Selection[]> = {};
    categories.forEach(cat => {
      initialSelections[cat._id] = [];
    });
    setSelections(initialSelections);
  }, [categories]);

  if (isLoading) return <Spinner />;
  if (isError) return <p className="text-red-500">Failed to load products.</p>;

  // Handlers
  const handleAddProduct = (categoryId: string, subcategoryIndex: number) => {
    const category = categories.find(cat => cat._id === categoryId);
    const sub = category?.subcategories?.[subcategoryIndex];
    if (!sub) return;

    setSelections(prev => {
      const alreadyAdded = prev[categoryId].some(p => p.selectedSub?.name === sub.name);
      if (alreadyAdded) return prev;

      return {
        ...prev,
        [categoryId]: [
          ...prev[categoryId],
          { selectedSub: sub, quantity: 1, unit: sub.unit ?? ''  },
        ],
      };
    });
  };

  const handleQuantityChange = (categoryId: string, index: number, delta: number) => {
    setSelections(prev => {
      const updated = [...prev[categoryId]];
      const current = updated[index];
      if (!current || !current.selectedSub) return prev;

      const newQty = Math.max(1, (current.quantity || 1) + delta);
      updated[index] = { ...current, quantity: newQty };
      return { ...prev, [categoryId]: updated };
    });
  };

  const handleRemoveProduct = (categoryId: string, index: number) => {
    setSelections(prev => {
      const updated = [...prev[categoryId]];
      updated.splice(index, 1);
      return { ...prev, [categoryId]: updated };
    });
  };

  const getTotalPrice = (): number => {
    return Object.values(selections).flat().reduce((acc, item) => {
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
      return;
    }
    setSslCommerzWarning(false);
    setPaymentMethod(val);
  };

  const handleDeliveryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value as 'insideRangpur' | 'outsideRangpur');
  };

  const resetForm = () => {
    const initialSelections: Record<string, Selection[]> = {};
    categories.forEach(cat => {
      initialSelections[cat._id] = [];
    });
    setSelections(initialSelections);
    setAddress({ fullName: '', phoneNumber: '', fullAddress: '' });
    setSiteNote('');
    setPaymentMethod('cash_on_delivery');
    setSslCommerzWarning(false);
    setDeliveryOption('insideRangpur');
  };

  const handleSubmitOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  // Redirect to login if user is not authenticated
  if (!token) {
    toast.error('অর্ডার করতে লগইন করুন।');
    router.push('/login'); // redirect to login page
    return;
  }
    if (!address.fullName.trim() || !address.phoneNumber.trim() || !address.fullAddress.trim()) {
      toast.error('দয়া করে সকল ঠিকানা তথ্য পূরণ করুন।');
      return;
    }
const validUnits: UnitType[] = ["kg", "gm", "litre", "piece"];

const orderItems: TCustomBazerOrderItem[] = Object.entries(selections)
  .flatMap(([catId, selArr]) =>
    selArr.map((sel, index) => {
      const product = categories.find(cat => cat._id === catId);
      if (!product) throw new Error(`Product not found for id ${catId}`);

      // ensure unit matches UnitType
      const unit: UnitType | undefined = validUnits.includes(sel.unit as UnitType)
        ? (sel.unit as UnitType)
        : undefined;

      return {
        _id: `${catId}-${index}`,
        product: product._id,
        subcategoryName: sel.selectedSub!.name,
        unit,
        pricePerUnit: sel.selectedSub!.pricePerUnit,
        quantity: sel.quantity,
        totalPrice: sel.selectedSub!.pricePerUnit * sel.quantity,
      };
    })
  );


    if (orderItems.length === 0) {
      toast.error('দয়া করে অন্তত একটি পণ্য নির্বাচন করুন।');
      return;
    }

    const completePayload: TCustomBazerOrder = {
      orderItems,
      totalAmount: getTotalPrice(),
      status: 'pending',
      paymentMethod,
      deliveryOption,
      address,
      siteNote,
    };

    try {
      await addCustomBazarOrder(completePayload).unwrap();

      toast.success('✅ অর্ডার সফলভাবে সাবমিট হয়েছে!');
      router.push('/order')
      resetForm();
    } catch (error) {
      console.error('❌ অর্ডার সাবমিট করতে সমস্যা হয়েছে:', error);
      toast.error('❌ অর্ডার সাবমিট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-3 sm:p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 কাস্টম বাজার অর্ডার</h2>

      <form onSubmit={handleSubmitOrder} className="space-y-6" noValidate>
        {/* Product Selection */}
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1 sm:pr-2">
          {categories.map(category => (
            <div key={category._id} className="space-y-2 border p-4 rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold text-gray-700">{category.category}</h3>

              <select
                className="w-full border px-2 py-1 rounded"
                onChange={e => {
                  if (e.target.value === '') return;
                  handleAddProduct(category._id, Number(e.target.value));
                }}
                defaultValue=""
              >
                <option value="">Select Subcategory to Add</option>
                {category.subcategories?.map((sub, subcategoryIndex) => (
                  <option
                    key={`${category._id}-${subcategoryIndex}`}
                    value={subcategoryIndex}
                  >
                    {sub.name} - {sub.pricePerUnit}৳
                  </option>
                ))}
              </select>

              {/* Selected products */}
              <div className="space-y-2 mt-2">
                {(selections[category._id] || []).map((sel, idx) => (
                  <div
                    key={idx}
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border bg-gray-50 p-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto]"
                  >
                    <span className="break-words font-medium">{sel.selectedSub?.name}</span>

                    {/* Read-only unit */}
                    <span className="border px-2 py-1 rounded bg-gray-100 text-center">
                      {sel.unit}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 justify-self-end sm:justify-self-auto">
                      <button
                        type="button"
                        className="rounded border border-amber-600 bg-amber-500 px-2 text-gray-950 transition-colors hover:bg-amber-600 disabled:opacity-50"
                        onClick={() => handleQuantityChange(category._id, idx, -1)}
                        disabled={sel.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{sel.quantity}</span>
                      <button
                        type="button"
                        className="rounded border border-amber-600 bg-amber-500 px-2 text-gray-950 transition-colors hover:bg-amber-600"
                        onClick={() => handleQuantityChange(category._id, idx, 1)}
                      >
                        +
                      </button>
                    </div>
          <span className="font-semibold sm:justify-self-auto">
            {(sel.selectedSub?.pricePerUnit ?? 0) * sel.quantity}৳
          </span>

                    <button
                      type="button"
                      className="col-span-2 justify-self-end px-2 font-bold text-red-600 sm:col-span-1 sm:justify-self-auto"
                      onClick={() => handleRemoveProduct(category._id, idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Option */}
        <section className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold mb-2">ডেলিভারি অপশন</h3>
          <div className="flex flex-col gap-3">
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
                  {option === 'insideRangpur'
                    ? 'Inside Rangpur (Free)'
                    : 'Outside Rangpur (Free)'}
                </span>
                <input
                  type="radio"
                  name="deliveryOption"
                  value={option}
                  checked={deliveryOption === option}
                  onChange={handleDeliveryChange}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                    deliveryOption === option
                      ? 'border-amber-600 bg-amber-600'
                      : 'border-gray-300'
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
            Enter Your Order Note
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
          <div className="flex max-w-sm flex-col gap-3 sm:flex-row sm:gap-4">
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
                className="sr-only"
              />
              Cash on Delivery
            </label>

            <label
              className={`cursor-not-allowed opacity-50 border rounded-lg p-4 flex-1 text-center`}
              onClick={() => setSslCommerzWarning(true)}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="sslcommerz"
                checked={paymentMethod === 'sslcommerz'}
                onChange={handlePaymentChange}
                className="sr-only"
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

        {/* Order Summary */}
        <div className="mt-6 flex flex-col items-stretch border-t pt-4 sm:items-end">
          <div className="break-words text-lg font-bold text-gray-800 sm:text-xl">
            মোট অর্ডার মূল্য:{' '}
            <span className="text-green-600">{getTotalPrice()}৳</span>
          </div>
          <button
            type="submit"
            className="mt-3 w-full rounded border border-amber-600 bg-amber-500 px-5 py-2 text-gray-950 shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-50 sm:w-auto"
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
