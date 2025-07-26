'use client';

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {   useUpdateProfileMutation } from "@/redux/features/UserProfile/userProfileApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";

export default function ProfilePage() {



  const { data, isLoading, isError } = useGetMeQuery({});
  
console.log('Profile data:', data);

  const [updateProfile] = useUpdateProfileMutation();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    gender: '',
    address: '',
    profileImage: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    if (data?.data) {
      const { gender, address, profileImage } = data.data;
      setFormData({ gender, address, profileImage });
    }
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const id = data?.data?._id;
      if (!id) return;
      const res = await updateProfile({ id, ...formData }).unwrap();
      toast.success(res?.message || "✅ Profile updated successfully");
      setModalOpen(false);
    } catch (err: any) {
      toast.error("❌ Failed to update profile");
    }
  };

  if (isLoading) return <p className="p-4">Loading profile...</p>;
  if (isError || !data?.data) return <p className="p-4 text-red-500">Failed to load profile.</p>;

  const { gender, address, profileImage } = data.data;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        <Image
          src={profileImage || '/default-user.png'}
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
        <p><strong>Gender:</strong> {gender}</p>
        <p><strong>Address:</strong> {address}</p>
        <Button onClick={handleEditClick}>Edit Profile</Button>
      </div>

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Gender"
            />
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <Input
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="Profile Image URL"
            />
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
