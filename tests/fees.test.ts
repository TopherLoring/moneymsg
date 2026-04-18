import { describe, expect, test } from "bun:test";
import {
  calculateGrossFromNet,
  calculateFeeFromGross,
  addMoney,
  subtractMoney,
} from "../src/domain/fees/index";
import { FEE_FIXED, FEE_PERCENT } from "../src/config/constants";

describe("Fees Domain", () => {
  describe("calculateGrossFromNet", () => {
    test("correctly calculates gross, fee, and net for a standard amount", () => {
      const result = calculateGrossFromNet("100.00");
      // Formula: gross = (100.00 + 0.50) / (1 - 0.0175) = 100.50 / 0.9825 = 102.290076...
      expect(result.net).toBe("100.0000");
      expect(result.gross).toBe("102.2901"); // rounded to 4 places
      expect(result.fee).toBe("2.2901"); // 102.2901 - 100.0000
    });

    test("throws error if net amount is zero", () => {
      expect(() => calculateGrossFromNet("0")).toThrow("Net amount must be positive");
    });

    test("throws error if net amount is negative", () => {
      expect(() => calculateGrossFromNet("-10.00")).toThrow("Net amount must be positive");
    });

    test("handles small positive amounts correctly", () => {
      const result = calculateGrossFromNet("1.00");
      // gross = 1.50 / 0.9825 = 1.526717...
      expect(result.net).toBe("1.0000");
      expect(result.gross).toBe("1.5267");
      expect(result.fee).toBe("0.5267");
    });
  });

  describe("calculateFeeFromGross", () => {
    test("correctly calculates gross, fee, and net for a standard amount", () => {
      const result = calculateFeeFromGross("100.00");
      // fee = 100 * 0.0175 + 0.50 = 1.75 + 0.50 = 2.25
      // net = 100 - 2.25 = 97.75
      expect(result.gross).toBe("100.0000");
      expect(result.fee).toBe("2.2500");
      expect(result.net).toBe("97.7500");
    });

    test("throws error if gross amount is zero", () => {
      expect(() => calculateFeeFromGross("0")).toThrow("Gross amount must be positive");
    });

    test("throws error if gross amount is negative", () => {
      expect(() => calculateFeeFromGross("-50.00")).toThrow("Gross amount must be positive");
    });

    test("throws error if fee exceeds or equals gross amount", () => {
      // If gross is very small, fee (at least 0.50 fixed) will exceed it
      expect(() => calculateFeeFromGross("0.40")).toThrow("Fee exceeds or equals gross amount");
      expect(() => calculateFeeFromGross("0.50")).toThrow("Fee exceeds or equals gross amount");
    });
  });

  describe("addMoney", () => {
    test("correctly adds two amounts with fixed precision", () => {
      expect(addMoney("10.50", "5.25")).toBe("15.7500");
      expect(addMoney("0.0001", "0.0002")).toBe("0.0003");
    });

    test("handles negative amounts correctly", () => {
      expect(addMoney("10.00", "-5.00")).toBe("5.0000");
    });
  });

  describe("subtractMoney", () => {
    test("correctly subtracts two amounts with fixed precision", () => {
      expect(subtractMoney("10.50", "5.25")).toBe("5.2500");
      expect(subtractMoney("5.00", "10.00")).toBe("-5.0000");
    });
  });
});
