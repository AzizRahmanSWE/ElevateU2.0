'use client';
import { CompleteProfileForm } from "@/components/forms/user-input-form";

export default function CompleteProfile() {
  return (
    <div className="container max-w-2xl py-12">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Complete Your Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Please fill out your profile information to continue
        </p>
      </div>
      <CompleteProfileForm />
    </div>
  </div>
  );
};