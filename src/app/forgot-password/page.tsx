'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/form/FromInput';
import { useForgotPasswordMutation } from '@/redux/features/auth/authApi';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Unable to send the reset link. Please try again.';
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await forgotPassword({ email: email.trim().toLowerCase() }).unwrap();
      setSubmittedEmail(email.trim());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md border border-amber-200 shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            {submittedEmail ? <CheckCircle2 aria-hidden="true" /> : <Mail aria-hidden="true" />}
          </div>
          <CardTitle className="text-2xl">
            {submittedEmail ? 'Check your email' : 'Forgot your password?'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {submittedEmail
              ? `If an account exists for ${submittedEmail}, we sent a password reset link.`
              : 'Enter your account email and we will send you a secure reset link.'}
          </p>
        </CardHeader>

        <CardContent>
          {submittedEmail ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">
                The link expires in 10 minutes. Check your spam folder if it does not arrive.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setSubmittedEmail('')}
              >
                Send again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Email address"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                required
              />
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-700"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
