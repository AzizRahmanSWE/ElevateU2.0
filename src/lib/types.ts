// import { ConnectionProviderProps } from '@/providers/connections-provider'
import { z } from 'zod'

export const EditUserProfileSchema = z.object({
  email: z.string().email('Required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().optional(),
  clerkId: z.string().min(1, 'Required'),
  age: z.number().int().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  profilePicUrl: z.string().url().optional(),
  fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  medicalHistory: z.string().optional(),
  lifestyleHabits: z.string().optional(),
})