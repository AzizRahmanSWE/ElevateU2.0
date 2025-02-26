"server only";  
import { userCreateProps } from "../../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userCreate = async ({
  firstName,
  lastName,
  profilePicUrl,
  clerkId,
  email,
}: userCreateProps) => {
  try {
    console.log("info", {
      email,
      firstName: firstName,
      lastName: lastName,
      profilePicUrl: profilePicUrl,
      userId: clerkId,
    });

    const result = await prisma.userProfile.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        clerkId: clerkId,
        profilePicUrl: profilePicUrl,
        email,
      },
    });

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    await prisma.$disconnect();
  }
};