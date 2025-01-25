'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EditUserProfileSchema } from '@/lib/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

type Props = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    // Add other user fields as needed
  };
  onUpdate?: (data: any) => void;
};

const ProfileForm = ({ user, onUpdate }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EditUserProfileSchema>>({
    mode: 'onChange',
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: {
      firstName: "user.firstName",
      lastName: "user.lastName",
      email: "user.email",
      // Add other default values as needed
    },
  });

  const handleSubmit = async (values: z.infer<typeof EditUserProfileSchema>) => {
    setIsLoading(true);
    try {
      await onUpdate?.(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="First Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Last Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Last Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Email</FormLabel>
              <FormControl>
                <Input {...field} disabled={true} placeholder="Email" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;