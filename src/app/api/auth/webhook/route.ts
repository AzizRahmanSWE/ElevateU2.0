import { NextResponse } from "next/server";
// import { userCreate } from "../../../../../utils/data/user/userCreate";
// import { userUpdate } from "../../../../../utils/data/user/userUpdate";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";


export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      svix_id: svix_id,
      svix_timestamp: svix_timestamp,
      svix_signature: svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("❌ Error verifying webhook:", error);
    return new Response("Error occurred -- webhook verification failed", {
      status: 400,
    });
  }
  // get id and type
  const { id } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      try {
        await userCreate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          firstName: payload?.data?.first_name,
          lastName: payload?.data?.last_name,
          profilePicUrl: payload?.data?.profile_image_url,
          clerkId: payload?.data?.id,
        });

        return NextResponse.json({
          status: 200,
          message: "User info inserted",
        });
      } catch (error: any) {
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }
      break;

    case "user.updated":
      try {
        await userUpdate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          firstName: payload?.data?.first_name,
          lastName: payload?.data?.last_name,
          profilePicUrl: payload?.data?.profile_image_url,
          clerkId: payload?.data?.id,
          age: payload?.data?.age,
          gender: payload?.data?.gender,
          heightCm: payload?.data?.height_cm,
          weightKg: payload?.data?.weight_kg,
          fitnessLevel: payload?.data?.fitness_level,
          medicalHistory: payload?.data?.medical_history,
          lifestyleHabits: payload?.data?.lifestyle_habits,
        });

        return NextResponse.json({
          status: 200,
          message: "User info updated",
        });
      } catch (error: any) {
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }
      break;

    default:
      return new Response("Error occured -- unhandeled event type", {
        status: 400,
      });
  }

  return new Response("", { status: 201 });
}
