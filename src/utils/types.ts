// import { ConnectionProviderProps } from '@/providers/connections-provider'
import { z } from "zod";

export type userCreateProps = z.infer<typeof UserCreateSchema>;

const UserCreateSchema = z.object({
  firstName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, { message: "First Name must only contain letters" })
    .min(3, { message: "First Name required" })
    .describe("user first name"),
  lastName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, { message: "Last Name must only contain letters" })
    .min(3, { message: "Last Name required" })
    .describe("user last name"),
  clerkId: z.string().describe("user ID"),
  profilePicUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .describe("user profile image URL"),
  email: z.string().email({ message: "Invalid email" }).describe("user email"),
});

export type userUpdateProps = z.infer<typeof UserUpdateSchema>;

const UserUpdateSchema = z.object({
  firstName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, { message: "First Name must only contain letters" })
    .min(3, { message: "First Name required" })
    .describe("user first name"),
  lastName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, { message: "Last Name must only contain letters" })
    .min(3, { message: "Last Name required" })
    .describe("user last name"),
  clerkId: z.string().describe("user ID"),
  age: z.number().int().describe("user age"),
  gender: z.string().optional().describe("user gender"),
  heightCm: z.number().describe("user height in cm"),
  weightKg: z.number().describe("user weight in kg"),
  profilePicUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .describe("user profile image URL"),
  fitnessLevel: z.string().optional().describe("user fitness level"),
  medicalHistory: z.string().optional().describe("user medical history"),
  lifestyleHabits: z.string().optional().describe("user lifestyle habits"),
  email: z.string().email({ message: "Invalid email" }).describe("user email"),
});

