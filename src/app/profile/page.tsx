'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Sidebar from '@/components/shared/Sidebar';
import { useGetMeQuery } from '@/redux/features/auth/authApi';
import { useGetCustomerDetailsQuery, useAddProfileMutation, useUpdateProfileMutation } from '@/redux/features/UserProfile/userProfileApi';
import { FormInput } from '@/components/form/FromInput';
import { toast } from 'sonner';

const editableAddressFields = [
  'division',
  'district',
  'postalCode',
  'phoneNumber',
  'location',
  'messOrBasaName',
  'paraName',
] as const;

type Address = {
  division: string;
  district: string;
  postalCode: string;
  phoneNumber: string;
  location: string;
  messOrBasaName: string;
  paraName?: string;
};

type CustomerDataType = {
  _id: string;
  gender: string;
  profileImage: string;
  address: Address;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
};

export default function ProfilePage() {
  const { data: meData, isLoading: meLoading, isError: meError } = useGetMeQuery({});
  const userId = meData?.data?._id;

  const { data: customerData, isLoading: customerLoading, isError: customerError } =
    useGetCustomerDetailsQuery(userId!, { skip: !userId });

  const [modalOpen, setModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    gender: '',
    address: {
      division: '',
      district: '',
      postalCode: '',
      phoneNumber: '',
      location: '',
      messOrBasaName: '',
      paraName: '',
    },
  });

  const [addProfile, { isLoading: isUpdating }] = useAddProfileMutation();

  const [updateProdile] = useUpdateProfileMutation();

  if (meLoading || customerLoading) return <p className="p-6 text-lg">⏳ Loading profile...</p>;
  if (meError || customerError) return <p className="p-6 text-red-600">❌ Failed to load profile.</p>;

  const {
    gender = '',
    profileImage = '',
    address = {
      division: '',
      district: '',
      postalCode: '',
      phoneNumber: '',
      location: '',
      messOrBasaName: '',
      paraName: '',
    },
    user: { name = '', email = '' } = {},
  } = customerData?.data || {};

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, gender: e.target.value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleEditClick = () => {
    setFormData({
      gender,
      address,
    });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      const payload: any = {};

      if (formData.gender.trim()) payload.gender = formData.gender;

      const cleanedAddress = editableAddressFields.reduce((acc, key) => {
        const value = formData.address[key];
        if (value && value.trim()) {
          acc[key] = value.trim();
        }
        return acc;
      }, {} as any);

      if (Object.keys(cleanedAddress).length > 0) {
        payload.address = cleanedAddress;
      }

      if (Object.keys(payload).length > 0) {
        formDataToSend.append('data', JSON.stringify(payload));
      }

      if (imageFile) {
        formDataToSend.append('file', imageFile);
      }
      

      await addProfile(formDataToSend).unwrap();
      toast.success('✅ Profile updated successfully');
      setModalOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || '❌ Failed to update profile');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="w-32 h-32 border-2 border-blue-600 shadow">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 text-gray-800">
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p><span className="font-medium">Email:</span> {email}</p>
              <p><span className="font-medium">Gender:</span> {gender}</p>
              <div className="mt-2 space-y-1">
                <p className="font-semibold">Address Details:</p>
                <p><span className="font-medium">Division:</span> {address.division}</p>
                <p><span className="font-medium">District:</span> {address.district}</p>
                <p><span className="font-medium">Postal Code:</span> {address.postalCode}</p>
                <p><span className="font-medium">Phone Number:</span> {address.phoneNumber}</p>
                <p><span className="font-medium">Location:</span> {address.location}</p>
                <p><span className="font-medium">Mess or Basa Name:</span> {address.messOrBasaName}</p>
                {address.paraName && (
                  <p><span className="font-medium">Para Name:</span> {address.paraName}</p>
                )}
              </div>
            </div>
          </div>
          <div className="text-end">
            <Button onClick={handleEditClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              ✏️ Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Upload Profile Image</label>
              <input type="file" onChange={handleImageChange} className="w-full p-1" />
            </div>

            <Button onClick={() => setAddressModalOpen(true)} variant="outline" className="w-full">
              🏠 Edit Address
            </Button>

            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full bg-green-600 text-white mt-2"
            >
              {isUpdating ? 'Saving...' : '✅ Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Address Modal */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {editableAddressFields.map((key) => (
              <FormInput
                key={key}
                name={key}
                type="text"
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                value={formData.address[key]}
                onChange={handleAddressChange}
              />
            ))}
          </div>

          <Button onClick={() => setAddressModalOpen(false)} className="w-full bg-blue-600 text-white mt-4">
            ✅ Save Address
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
