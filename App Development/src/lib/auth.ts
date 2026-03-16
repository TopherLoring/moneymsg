import { FastifyRequest } from "fastify";
import { AppError } from "./errors";

const AUTH_HEADER = "x-api-key";

export function requireApiKey(request: FastifyRequest) {
  const key = request.headers[AUTH_HEADER] as string | undefined;
  const expected = process.env.API_KEY;
  if (!expected) return;
  if (!key || key !== expected) {
    throw new AppError("Unauthorized", "UNAUTHORIZED", 401);
  }
}
