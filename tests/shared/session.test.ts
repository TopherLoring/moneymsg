import { describe, expect, test, } from "bun:test";

// Set environment variables before importing the modules that require them
process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
process.env.JWT_SECRET = "super_secret_test_key_12345678901234";
process.env.TABAPAY_WEBHOOK_SECRET = "tabapay_secret";
process.env.DWOLLA_WEBHOOK_SECRET = "dwolla_secret";
process.env.WEBHOOK_SHARED_SECRET = "shared_secret";
process.env.ALVIERE_API_KEY = "alviere_key";
process.env.ALVIERE_API_URL = "https://api.alviere.com";
process.env.PLAID_ENABLED = "false";
process.env.DWOLLA_ENABLED = "false";
process.env.TABAPAY_ENABLED = "false";

import jwt from "jsonwebtoken";
import { issueAccessToken, issueRefreshToken, verifyToken } from "../../src/shared/session";
import { AppError } from "../../src/shared/errors";
import { env } from "../../src/config/env";

describe("Session Utilities", () => {
  const userId = "user_12345";
  const role = "user";

  describe("issueAccessToken", () => {
    test("generates a valid access token", () => {
      const token = issueAccessToken(userId, role);
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      expect(decoded.sub).toBe(userId);
      expect(decoded.role).toBe(role);
      expect(decoded.type).toBe("access");
      expect(decoded.iss).toBe(env.JWT_ISSUER);
    });
  });

  describe("issueRefreshToken", () => {
    test("generates a valid refresh token", () => {
      const token = issueRefreshToken(userId, role);
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      expect(decoded.sub).toBe(userId);
      expect(decoded.role).toBe(role);
      expect(decoded.type).toBe("refresh");
      expect(decoded.iss).toBe(env.JWT_ISSUER);
    });
  });

  describe("verifyToken", () => {
    test("successfully verifies a valid access token", () => {
      const token = issueAccessToken(userId, role);
      const decoded = verifyToken(token, "access");
      expect(decoded.sub).toBe(userId);
      expect(decoded.role).toBe(role);
      expect(decoded.type).toBe("access");
    });

    test("successfully verifies a valid refresh token", () => {
      const token = issueRefreshToken(userId, role);
      const decoded = verifyToken(token, "refresh");
      expect(decoded.sub).toBe(userId);
      expect(decoded.role).toBe(role);
      expect(decoded.type).toBe("refresh");
    });

    test("defaults to checking for access token", () => {
      const token = issueAccessToken(userId, role);
      const decoded = verifyToken(token); // should default to "access"
      expect(decoded.type).toBe("access");
    });

    test("throws AppError if token type mismatches", () => {
      const token = issueAccessToken(userId, role);
      let error: any;
      try {
        verifyToken(token, "refresh");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.status).toBe(401);
      expect(error.message).toBe("Expected refresh token");
    });

    test("throws AppError for expired tokens", () => {
      const expiredToken = jwt.sign(
        { sub: userId, role, type: "access" },
        env.JWT_SECRET,
        {
          expiresIn: "-1h", // expired 1 hour ago
          issuer: env.JWT_ISSUER,
        }
      );

      let error: any;
      try {
        verifyToken(expiredToken, "access");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.status).toBe(401);
      expect(error.message).toBe("Token expired");
    });

    test("throws AppError for tokens with invalid signatures", () => {
      const invalidToken = jwt.sign(
        { sub: userId, role, type: "access" },
        "wrong_secret_that_is_at_least_32_characters_long", // signed with different secret
        {
          expiresIn: "1h",
          issuer: env.JWT_ISSUER,
        }
      );

      let error: any;
      try {
        verifyToken(invalidToken, "access");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.status).toBe(401);
      expect(error.message).toBe("Invalid token");
    });

    test("throws AppError for malformed tokens", () => {
      let error: any;
      try {
        verifyToken("not.a.real.jwt", "access");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.status).toBe(401);
      expect(error.message).toBe("Invalid token");
    });

    test("throws AppError if issuer is invalid", () => {
      const invalidIssuerToken = jwt.sign(
        { sub: userId, role, type: "access" },
        env.JWT_SECRET,
        {
          expiresIn: "1h",
          issuer: "wrong_issuer",
        }
      );

      let error: any;
      try {
        verifyToken(invalidIssuerToken, "access");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.status).toBe(401);
      expect(error.message).toBe("Invalid token");
    });
  });
});
