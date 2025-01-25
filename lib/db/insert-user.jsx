import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function createOrUpdateUser(user) {
  if (!user) {
    throw new Error('User data is required')
  }
  if (!user.email) {
    throw new Error('User Email is required')
  }
  if (!user.firstName) {
    throw new Error('User First Name is required')
  }
  if (!user.lastName) {
    throw new Error('User Last Name is required')
  }

  console.log('Creating user:', user)
  try {
    const updatedUser = await prisma.userProfile.upsert({
      where: { clerkId: user.clerkId },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicUrl: user.profilePicUrl || null,
        fitnessLevel: user.fitnessLevel || null,
        age: user.age || null,
        gender: user.gender || null,
        updatedAt: new Date(),
      },
      create: {
        id: user.id,
        clerkId: user.clerkId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicUrl: user.profilePicUrl || null,
        fitnessLevel: user.fitnessLevel || null,
        age: user.age || null,
        gender: user.gender || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error) {
    console.error('Failed to create user in database:', error)
    throw new Error(`Failed to create user or update: ${error.message}`)
  } finally {
    await prisma.$disconnect();
  }
}