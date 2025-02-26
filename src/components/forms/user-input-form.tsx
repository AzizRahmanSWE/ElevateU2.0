"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { EditUserProfileSchema } from "../../../utils/types";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"), // Add email validation
  age: z.coerce.number().min(13, "Must be at least 13 years old"),
  gender: z.enum(["Male", "Female", "Other"]),
  heightCm: z.coerce.number().min(100).max(500),
  weightKg: z.coerce.number().min(30).max(500),
  fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  medicalHistory: z.string().optional(),
  lifestyleHabits: z.string().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

export function CompleteProfileForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 13,
      gender: "Male",
      heightCm: 170,
      weightKg: 70,
      fitnessLevel: "Beginner",
      medicalHistory: "",
      lifestyleHabits: "",
    },
  });

  // Fetch the user and pre-fill the form with any existing profile data.
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
  
        // Set email always from auth
        form.setValue("email", user.email!);
  
        // Fetch profile data from Supabase
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
  
        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
          return;
        }
  
        if (profile) {
          // Sanitize profile data: fallback to defaults if any field is null.
          const sanitizedProfile: ProfileFormData = {
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: user.email!, // Always use auth email
            age: profile.age !== null && profile.age !== undefined ? profile.age : 13,
            gender: profile.gender || "Male",
            heightCm: profile.heightCm !== null && profile.heightCm !== undefined ? profile.heightCm : 170,
            weightKg: profile.weightKg !== null && profile.weightKg !== undefined ? profile.weightKg : 70,
            fitnessLevel: profile.fitnessLevel || "Beginner",
            medicalHistory: profile.medicalHistory || "",
            lifestyleHabits: profile.lifestyleHabits || "",
          };
  
          // Reset form with sanitized data
          form.reset(sanitizedProfile);
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        toast.error("Failed to load profile data");
      }
    }
  
    fetchUserProfile();
  }, [supabase, form, router]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Add createdAt for new records
      const timestamp = new Date().toISOString();

      const { error } = await supabase.from("user_profiles").upsert(
        {
          user_id: user.id,
          email: user.email,
          ...data,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          onConflict: "user_id", // Specify the unique constraint
          ignoreDuplicates: false, // Update if exists
        }
      );

      if (error) throw error;

      toast.success("Profile updated successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to complete profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 space-y-8"
      >
        {/* First Name */}
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
        {/* Last Name */}
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
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Email</FormLabel>
              <FormControl>
                <Input {...field} disabled placeholder="Email" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Age */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Age</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Age"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Gender</FormLabel>
              <FormControl>
                <select
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-900/50 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Height */}
        <FormField
          control={form.control}
          name="heightCm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Height (cm)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Height in cm"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Weight */}
        <FormField
          control={form.control}
          name="weightKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Weight (kg)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Weight in kg"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Fitness Level */}
        <FormField
          control={form.control}
          name="fitnessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Fitness Level</FormLabel>
              <FormControl>
                <select
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-900/50 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Medical History */}
        <FormField
          control={form.control}
          name="medicalHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Medical History</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Your medical history" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Lifestyle Habits */}
        <FormField
          control={form.control}
          name="lifestyleHabits"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Lifestyle Habits</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Your lifestyle habits" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
