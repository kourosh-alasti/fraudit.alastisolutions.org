import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";

export function verifyClerkWebhook(
  payload: string,
  headers: Record<string, string>,
  secret: string,
): WebhookEvent {
  // Svix 2 verifies the signature but no longer returns the parsed payload.
  new Webhook(secret).verify(payload, headers);
  return JSON.parse(payload) as WebhookEvent;
}
