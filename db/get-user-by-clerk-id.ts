import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function getUserByClerkId(clerkId: string) {
  if (!clerkId) {
    throw new Error('Missing required clerkId')
  }

  console.log('Fetching user with clerkId:', clerkId)
  try {
    const user = await prisma.userProfile.findUnique({
      where: { clerkId: clerkId },
    });
    if (!user) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }
    console.log('User fetched:', user)
    return user;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
}