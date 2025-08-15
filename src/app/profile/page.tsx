"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "@/components/shared/Sidebar";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import {
  useGetCustomerDetailsQuery,
  useAddProfileMutation,
} from "@/redux/features/UserProfile/userProfileApi";
import { FormInput } from "@/components/form/FromInput";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { TGenericErrorResponse } from "@/types/error";
import ProtectedRoute from "@/components/ProtectedRoute";

const editableAddressFields = [
  "division",
  "district",
  "postalCode",
  "phoneNumber",
  "location",
  "messOrBasaName",
  "paraName",
] as const;

type Address = {
  [key in typeof editableAddressFields[number]]: string;
};

type FormData = {
  gender: string;
  address: Address;
};

function ProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    gender: "",
    address: {
      division: "",
      district: "",
      postalCode: "",
      phoneNumber: "",
      location: "",
      messOrBasaName: "",
      paraName: "",
    },
  });

  const {
    data: meData,
    isLoading: meLoading,
    isError: meError,
  } = useGetMeQuery({});

  const userId = meData?.data?._id;

  const {
    data: customerData,
    isLoading: customerLoading,
    refetch,
  } = useGetCustomerDetailsQuery(userId ?? "", { skip: !userId });

  const [addProfile, { isLoading: isUpdating }] = useAddProfileMutation();

  useEffect(() => {
    if (customerData?.data) {
      const { gender = "", address = {} } = customerData.data;
      setFormData({
        gender,
        address: {
          division: address.division || "",
          district: address.district || "",
          postalCode: address.postalCode || "",
          phoneNumber: address.phoneNumber || "",
          location: address.location || "",
          messOrBasaName: address.messOrBasaName || "",
          paraName: address.paraName || "",
        },
      });
    }
  }, [customerData]);

  if (meLoading || customerLoading) return <Spinner />;
  if (meError) return <p className="text-red-500">❌ Failed to fetch user.</p>;

  const user = customerData?.data?.user || meData?.data || {};
  const gender = customerData?.data?.gender || "";
  const profileImage = customerData?.data?.profileImage || "";
  const address = customerData?.data?.address || formData.address;

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "gender") {
      setFormData((prev) => ({ ...prev, gender: value }));
    }
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  function isErrorWithData(error: unknown): error is { data: Partial<TGenericErrorResponse> } {
    return (
      typeof error === "object" &&
      error !== null &&
      "data" in error &&
      typeof (error as Record<string, unknown>).data === "object" &&
      (error as Record<string, unknown>).data !== null
    );
  }

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      const payload: Partial<FormData> = {};

      if (formData.gender.trim()) payload.gender = formData.gender;

      const cleanedAddress = editableAddressFields.reduce((acc, key) => {
        const value = formData.address[key];
        if (value && value.trim()) acc[key] = value.trim();
        return acc;
      }, {} as Partial<Address>);

      if (Object.keys(cleanedAddress).length > 0) {
        payload.address = cleanedAddress as Address;
      }

      if (Object.keys(payload).length > 0) {
        formDataToSend.append("data", JSON.stringify(payload));
      }

      if (imageFile) {
        formDataToSend.append("file", imageFile);
      }

      await addProfile(formDataToSend).unwrap();
      toast.success("✅ Profile updated successfully");
      refetch();
      setModalOpen(false);
    } catch (error: unknown) {
      if (isErrorWithData(error)) {
        toast.error(error.data.message || "❌ Failed to update profile");
      } else {
        toast.error("❌ Failed to update profile");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <aside>
        <Sidebar />
      </aside>

      <div className="flex-1 p-4">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileImage} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">
              Email: <span className="font-medium text-gray-800">{user.email}</span>
            </p>
            <p className="text-gray-600">
              Gender: <span className="font-medium text-gray-800">{gender || "Not set"}</span>
            </p>
          </div>

          {/* Address */}
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-1">Shipping Address:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {editableAddressFields.map((key) => (
                <div key={key} className="flex gap-1">
                  <span className="font-medium capitalize">{key}:</span>
                  <span>{address?.[key] || "N/A"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <div className="text-end mt-6">
            <Button
              className="border border-amber-400"
              variant={"outline"}
              onClick={() => setModalOpen(true)}
            >
              ✏️ Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label className="block text-sm font-medium">Upload Image</label>
            <input type="file" onChange={handleImageChange} />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAddressModalOpen(true)}
            >
              🏠 Edit Address
            </Button>

            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full bg-blue-600 text-white"
            >
              {isUpdating ? "Saving..." : "✅ Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Shipping Address</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editableAddressFields.map((key) => (
              <FormInput
                key={key}
                name={key}
                type="text"
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                value={formData.address[key]}
                onChange={handleAddressChange}
              />
            ))}
          </div>
          <Button
            onClick={() => setAddressModalOpen(false)}
            className="w-full mt-4 bg-green-600 text-white"
          >
            ✅ Save Address
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function WrappedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
