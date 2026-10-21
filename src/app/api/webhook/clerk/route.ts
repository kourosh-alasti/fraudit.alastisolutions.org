import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyClerkWebhook } from "@/lib/clerk-webhook";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET! || ``;

export async function POST(req: Request) {
  const payloadString = await req.text();
  const headerPayload = req.headers;

  try {
    const res = verifyClerkWebhook(
      payloadString,
      {
        "svix-id": headerPayload.get("svix-id")!,
        "svix-timestamp": headerPayload.get("svix-timestamp")!,
        "svix-signature": headerPayload.get("svix-signature")!,
      },
      webhookSecret,
    );

    switch (res.type) {
      case "user.created":
        await db.insert(users).values({
          id: res.data.id,
        });
        break;
      case "user.deleted":
        await db.delete(users).where(eq(users.id, res.data.id!));
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error(err);

    return new NextResponse("Webhook Error", {
      status: 400,
    });
  }
}
