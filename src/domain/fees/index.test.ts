import { describe, expect, test } from "bun:test";
import { calculateFeeFromGross } from "./index";

describe("Fees Domain", () => {
  describe("calculateFeeFromGross", () => {
    test("throws an error for negative gross amount", () => {
      expect(() => calculateFeeFromGross("-10.00")).toThrow("Gross amount must be positive");
    });

    test("throws an error for zero gross amount", () => {
      expect(() => calculateFeeFromGross("0.00")).toThrow("Gross amount must be positive");
    });

    test("calculates fee correctly for valid positive amount", () => {
      // 100 * 0.0175 + 0.50 = 2.25
      const result = calculateFeeFromGross("100.00");
      expect(result.gross).toBe("100.0000");
      expect(result.fee).toBe("2.2500");
      expect(result.net).toBe("97.7500");
    });
  });
});
