import assert from "node:assert/strict";
import { test } from "node:test";
import { Webhook } from "svix";
import { verifyClerkWebhook } from "../src/lib/clerk-webhook";

const secret = `whsec_${Buffer.from("fraudit-webhook-test-secret").toString("base64")}`;
const payload = JSON.stringify({
  type: "user.created",
  data: { id: "user_test" },
});
const id = "msg_test";
const now = new Date();
const headers = {
  "svix-id": id,
  "svix-timestamp": String(Math.floor(now.getTime() / 1000)),
  "svix-signature": new Webhook(secret).sign(id, now, payload),
};

test("returns the verified Clerk event with Svix 2", () => {
  assert.deepEqual(
    verifyClerkWebhook(payload, headers, secret),
    JSON.parse(payload),
  );
});

test("rejects payload tampering before parsing or handling the event", () => {
  assert.throws(() =>
    verifyClerkWebhook(
      payload.replace("user_test", "attacker"),
      headers,
      secret,
    ),
  );
});

test("rejects a missing signature", () => {
  assert.throws(() => verifyClerkWebhook(payload, {}, secret));
});
