import { describe, expect, test } from "bun:test";
import {
  generateRequestId,
  getRequestContext,
  withRequestContext,
  setContextField,
  RequestContext,
} from "../src/shared/requestContext";

describe("requestContext", () => {
  describe("generateRequestId", () => {
    test("returns a string starting with req_", () => {
      const id = generateRequestId();
      expect(id).toStartWith("req_");
      expect(id.length).toBeGreaterThan(4);
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
});
