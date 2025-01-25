import { NextResponse } from "next/server";
import createOrUpdateUser from "../../../../../lib/db/insert-user";

export async function POST(req: Request) {
  try {
    const user = await req.json();

    if (!user || !user.clerkId || !user.email) {
      return NextResponse.json(
        { status: 400, message: "User data is required" },
        { status: 400 }
      );
    }
    const createdUser = await createOrUpdateUser(user);
    return NextResponse.json(
      { status: 201, data: createdUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
