// import { db } from '@/lib/db'
// import { NextResponse, NextRequest } from 'next/server'
// import { Webhook } from 'svix'


// export async function POST(req: NextRequest) {
//   // 1: get webhook signing secret from environment variables
//   const secret = process.env.CLERK_WEBHOOK_SECRET;

//   if (!secret) {
//     console.error('Missing Clerk Webhook secret');
//     return NextResponse.json({ error: 'Missing Clerk Webhook secret' } , { status: 500 })
//   }
//   // 2: get raw body from request
//   const payload = await req.text();

//   // 3: get signature from headers
//   const svixHeaders = {
//     'svix-id': req.headers.get('svix-id') as string,
//     'svix-timestamp': req.headers.get('svix-timestamp') as string,
//     'svix-signature': req.headers.get('svix-signature') as string,
//   }

//   // 4: verify signature using svix library
//   const wh = new Webhook(secret);
//   let event: any;

//   try {
//     event = wh.verify(payload, svixHeaders);
//   } catch (err) {
//     console.error('Error verifying failed:', err);
//     return NextResponse.json({ error: 'Webhook verifying failed' }, { status: 400 });
//   }

//   // 5: handle webhook event based on type
//   const eventType = event.type;
//   const eventData = event.data;
//   console.log('Event Received', eventType, eventData);

//   if (eventType === 'user.created' || eventType === 'user.updated') {
//     // 6: extract user data from event

//     const { id, email_addresses, first_name, last_name, image_url } = eventData;
//     const email = email_addresses[0]?.email_address;

//     // 7: save user to database
//     try {
//       await db.userProfile.upsert({
//         where: { clerkId: id },
//         update: {
//           email,
//           firstName: first_name,
//           lastName: last_name,
//           profileImage: image_url,
//         },
//         create: {
//           clerkId: id,
//           email,
//           firstName: first_name || '',
//           lastName: last_name || '',
//           profileImage: image_url || '',
//         },
//       })
//       console.log('✅✅✅ User saved to database successfully', id);
//       return NextResponse.json({ message: 'User Profile saved to database successfully' }, { status: 200 });
//     } catch (error) {
//       console.error('Error saving user profile to database:', error);
//       return NextResponse.json({ error: 'Error saving user profile to database' }, { status: 500 });
//     }
//   } else {
//     // 8: unhandled event type
//     console.log('Unhandled event type', eventType);
//     return NextResponse.json({ message: 'Unhandled event type Recieved' }, { status: 200 });
//   }
// }

// // Disable body parsing to get raw body from request
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }