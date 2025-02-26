'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Optionally, if your redirect sends a "verified" param or similar,
    // you can show a toast message.
    const verified = searchParams.get('verified');
    if (verified) {
      toast.success("Email verified! You can now sign in.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Email Verification</h1>
      <p className="mb-6">
        Your email has been verified successfully.
      </p>
      <Link
        href="/login"
        className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition"
      >
        Sign In
      </Link>
    </div>
  );
}