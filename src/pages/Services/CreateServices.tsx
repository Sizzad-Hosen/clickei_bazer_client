'use client';

import React, { ChangeEvent, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/FromInput';
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

 const CreateServicePage = () => {
  const [form, setForm] = useState<FormState>({ name: '' });
  const [formError, setFormError] = useState<string>('');

  const [addService, { isLoading, isError, error }] = useAddServiceMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const res = await addService(form).unwrap();
      console.log('Service creation response:', res);

      toast.success('✅ Service created successfully!');
     
      setForm({ name: '' });
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
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Service Name"
              name="name"
              type="text"
              placeholder="Enter service name"
              value={form.name}
              onChange={handleChange}
              required
            />

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>

            {isError && !formError && (
              <p className="text-red-500 text-sm mt-2">
                {(error as ApiError)?.data?.message || 'Failed to create service'}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default CreateServicePage  