import { NextResponse } from "next/server";
import createOrUpdateUser from "../../../../../db/insert-user"

export async function POST(req: Request) {
  try {
    const user = await req.json();
    console.log("📥 Received user:", user);
    if (!user.clerkId || !user.firstName || !user.lastName) {
        return NextResponse.json({ status: 400, message: "Missing required fields" });
    }
    
    const createdUser = await createOrUpdateUser(user)
    console.log("✅ User created/updated:", createdUser);

    return NextResponse.json({ success: true, data: createdUser }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create/update user:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
