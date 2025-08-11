'use client';

import { ChangeEvent, useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { FormInput } from '@/components/form/FromInput';
import { useChangePasswordMutation } from '@/redux/features/auth/authApi';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();


const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    try {
      const res = await changePassword(data);

      if ('data' in res && res.data?.success) {
        Swal.fire('Success!', 'Password changed successfully', 'success');
        setFormData({ oldPassword: '', newPassword: '' });
      } else {
        Swal.fire('Error', res.data?.message || 'Failed to change password', 'error');
      }
    } catch {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen mx-auto bg-gray-100">
      <div className='min-h-screen mx-auto'>

      <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Change Password</h2>

          <FormInput
            label="Old Password"
            name="oldPassword"
            type="password"
            placeholder="Enter old password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />

          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
