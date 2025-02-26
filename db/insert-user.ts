"server only";
import { PrismaClient } from '@prisma/client'
const { userProfile } = new PrismaClient()

export default async function createOrUpdateUser(user: any) {
  if (!user.clerkId || !user.email || !user.firstName || !user.lastName) {
    throw new Error('Missing required user fields')
  }

  console.log("🔄 Creating/Updating user:", user);
  try {
    const updatedUser = await userProfile.upsert({
      where: { clerkId: user.clerkId },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age ? Number(user.age) : null,
        heightCm: user.heightCm ? Number(user.heightCm) : null,
        weightKg: user.weightKg ? Number(user.weightKg) : null,
        gender: user.gender || null,
        fitnessLevel: user.fitnessLevel || "Beginner",
        updatedAt: new Date(),
      },
      create: {
        clerkId: user.clerkId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age ? Number(user.age) : null,
        heightCm: user.heightCm ? Number(user.heightCm) : null,
        weightKg: user.weightKg ? Number(user.weightKg) : null,
        gender: user.gender || null,
        fitnessLevel: user.fitnessLevel || "Beginner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("✅ User successfully created/updated:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("❌ Database error:", error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
}