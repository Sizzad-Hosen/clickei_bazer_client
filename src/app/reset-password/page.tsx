'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/FromInput';
import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Unable to reset your password. The link may be invalid or expired.';
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing its security token. Request a new link.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.newPassword.length > 72) {
      setError('Password cannot exceed 72 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await resetPassword({ token, newPassword: form.newPassword }).unwrap();
      toast.success('Password reset successfully. You can now sign in.');
      router.replace('/login');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md border border-amber-200 shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <KeyRound aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Create a new password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Use at least 6 characters. Your reset link can only be used once.
          </p>
        </CardHeader>

        <CardContent>
          {!token && (
            <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              This reset link is invalid. Please request a new one.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="New password"
              name="newPassword"
              type="password"
              placeholder="Enter a new password"
              value={form.newPassword}
              onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
              autoComplete="new-password"
              required
            />
            <FormInput
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              placeholder="Enter the password again"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              autoComplete="new-password"
              required
            />
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <Button type="submit" variant="secondary" className="w-full" disabled={isLoading || !token}>
              {isLoading ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Need a new link?{' '}
            <Link href="/forgot-password" className="font-medium text-amber-700 hover:underline">
              Request one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
