'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Sidebar from '@/components/shared/Sidebar';
import { useGetMeQuery } from '@/redux/features/auth/authApi';
import { useGetCustomerDetailsQuery, useAddProfileMutation } from '@/redux/features/UserProfile/userProfileApi';
import { FormInput } from '@/components/form/FromInput';
import { toast } from 'sonner';
import Spinner from '@/components/Spinner';

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

  if (meLoading || customerLoading) return <Spinner></Spinner>
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
    user = { name: '', email: '', phone: '' },
  } = customerData?.data || {} as CustomerDataType;

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
    setFormData({ gender, address });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      const payload: any = {};

      if (formData.gender.trim()) payload.gender = formData.gender;

      const cleanedAddress = editableAddressFields.reduce((acc, key) => {
        const value = formData.address[key];
        if (value && value.trim()) acc[key] = value.trim();
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

 <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
  <Sidebar />

  <div className="flex-1 p-3 sm:p-6 md:p-10">
    <div className="bg-white shadow-xl rounded-2xl p-3 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-blue-600 shadow">
          <AvatarImage src={profileImage} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2 text-gray-800 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold">{user.name}</h2>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Gender:</span> {gender || 'Not set'}</p>

          <div className="mt-3 space-y-1">
            <p className="font-semibold">Address Details:</p>
            {editableAddressFields.map((key) => (
              <p key={key}><span className="font-medium">{key}:</span> {address[key]}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center sm:text-end">
        <Button  onClick={handleEditClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          ✏️ Edit Profile
        </Button>
      </div>
    </div>
  </div>

  {/* Edit Profile Dialog */}
  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
    <DialogContent className="max-w-xl ">
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

  {/* Address Dialog */}
  <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
    <DialogContent className="max-w-xl p-3 m-3">
      <DialogHeader>
        <DialogTitle>Edit Address</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
