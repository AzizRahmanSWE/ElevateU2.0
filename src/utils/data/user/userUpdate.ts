"server only";

import prisma from "@/lib/prisma";
import { userUpdateProps } from "../../types";
// import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers";

export const userUpdate = async ({
  firstName,
  lastName,
  clerkId,
  age,
  gender,
  heightCm,
  weightKg,
  profilePicUrl,
  fitnessLevel,
  medicalHistory,
  lifestyleHabits,
  email,
}: userUpdateProps) => {
  try {
    const result = await prisma.userProfile.update({
      where: {
        clerkId: clerkId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        age,
        gender,
        heightCm,
        weightKg,
        profilePicUrl: profilePicUrl,
        fitnessLevel,
        medicalHistory,
        lifestyleHabits,
        email,
      }
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await prisma.$disconnect();
  }
};
