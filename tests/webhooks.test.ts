import { describe, expect, test } from "bun:test";
import fastify from "fastify";
import crypto from "crypto";

// Mock env before importing routes
import { mock } from "bun:test";
mock.module("../src/config/env", () => ({
  env: {
    WEBHOOK_SHARED_SECRET: "dummy",
    TABAPAY_WEBHOOK_SECRET: "dummy",
    DWOLLA_WEBHOOK_SECRET: "dummy",
    WEBHOOK_MAX_SKEW_SECONDS: 300,
  }
}));

import { webhookRoutes } from "../src/modules/webhooks/http/routes";

describe("Webhook Routes", () => {
  test("returns 400 VALIDATION_FAILED when JSON parsing fails", async () => {
    const app = fastify();
    await webhookRoutes(app);

    const secret = "dummy";
    const invalidJson = "{ invalid-json }";

    // Generate valid HMAC for the invalid JSON
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(invalidJson, "utf8");
    const signature = hmac.digest("hex");

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/webhooks/tabapay",
      headers: {
        "x-webhook-secret": "dummy",
        "x-tabapay-signature": signature,
      },
      body: invalidJson,
    });

    expect(response.statusCode).toBe(400);
    const jsonBody = JSON.parse(response.body);
    expect(jsonBody).toEqual({
      error: "Invalid JSON payload",
      code: "VALIDATION_FAILED",
    });
  });
});
