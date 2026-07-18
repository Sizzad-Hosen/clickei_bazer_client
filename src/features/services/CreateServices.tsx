'use client';

import React, { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAddServiceMutation } from '@/redux/features/Services/serviceApi';

interface FormState {
  name: string;
}

interface ApiError {
  status?: number;
  data?: {
    message?: string;
  };
}

interface Props {
  onSuccess?: () => void; // Called after service is successfully created
}

const CreateServiceModal: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<FormState>({ name: '' });
  const [formError, setFormError] = useState<string>('');

  const [addService, { isLoading, isError, error }] = useAddServiceMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFormError('Service name is required.');
      return;
    }

    try {
      await addService(form).unwrap();
      toast.success('✅ Service created successfully!');
      setForm({ name: '' });
      if (onSuccess) onSuccess(); // Close modal and refresh list
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401 || apiError.status === 403) {
        toast.error('⛔ Unauthorized. Only admins can create services.');
      } else if (apiError.data?.message) {
        toast.error(`❌ ${apiError.data.message}`);
      } else {
        toast.error('⚠️ Something went wrong. Try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Service Name
      </label>
      <Input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter service name"
        className="w-full"
        required
      />
      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <Button variant={"secondary"} type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Create Service'}
      </Button>

      {isError && !formError && (
        <p className="text-red-500 text-sm mt-2">
          {(error as ApiError)?.data?.message || 'Failed to create service'}
        </p>
      )}
    </form>
  );
};

export default CreateServiceModal;
