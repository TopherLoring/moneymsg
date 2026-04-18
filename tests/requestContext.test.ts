import { describe, expect, test } from "bun:test";
import {
  generateRequestId,
  getRequestContext,
  withRequestContext,
  setContextField,
  getCorrelationMeta,
  RequestContext,
} from "../src/shared/requestContext";

describe("requestContext", () => {
  describe("generateRequestId", () => {
    test("returns a string starting with req_", () => {
      const id = generateRequestId();
      expect(id).toStartWith("req_");
    });

    test("returns a string of exactly 20 characters length", () => {
      const id = generateRequestId();
      expect(id.length).toBe(20);
    });

    test("contains only url-safe base64 characters after prefix", () => {
      const id = generateRequestId();
      // 12 bytes = 16 base64url chars
      expect(id.substring(4)).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    test("returns unique IDs", () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("getRequestContext", () => {
    test("returns undefined outside of context", () => {
      expect(getRequestContext()).toBeUndefined();
    });

    test("returns context inside withRequestContext", () => {
      const mockCtx: RequestContext = {
        requestId: "req_123",
        startedAt: Date.now(),
      };

      withRequestContext(mockCtx, () => {
        expect(getRequestContext()).toBe(mockCtx);
      });
    });
  });

  describe("setContextField", () => {
    test("updates field inside context", () => {
      const mockCtx: RequestContext = {
        requestId: "req_123",
        startedAt: Date.now(),
      };

      withRequestContext(mockCtx, () => {
        setContextField("userId", "user_456");
        expect(getRequestContext()?.userId).toBe("user_456");
        expect(mockCtx.userId).toBe("user_456");
      });
    });

    test("does nothing outside of context", () => {
      // This should not throw
      setContextField("userId", "user_456");
      expect(getRequestContext()).toBeUndefined();
    });
  });

  describe("getCorrelationMeta", () => {
    test("returns empty object outside of context (edge case)", () => {
      const meta = getCorrelationMeta();
      expect(meta).toEqual({});
    });

    test("returns metadata inside context", () => {
      const mockCtx: RequestContext = {
        requestId: "req_123",
        transactionId: "tx_789",
        providerCorrelationId: "prov_abc",
        userId: "user_456",
        startedAt: Date.now(),
      };

      withRequestContext(mockCtx, () => {
        const meta = getCorrelationMeta();
        expect(meta).toEqual({
          requestId: "req_123",
          transactionId: "tx_789",
          providerCorrelationId: "prov_abc",
          userId: "user_456",
        });
      });
    });

    test("returns metadata with undefined fields if not set", () => {
      const mockCtx: RequestContext = {
        requestId: "req_123",
        startedAt: Date.now(),
      };

      withRequestContext(mockCtx, () => {
        const meta = getCorrelationMeta();
        expect(meta).toEqual({
          requestId: "req_123",
          transactionId: undefined,
          providerCorrelationId: undefined,
          userId: undefined,
        });
      });
    });
  });
});
