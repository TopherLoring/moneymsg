import { describe, expect, test } from "bun:test";
import { calculateFeeFromGross, calculateGrossFromNet, addMoney, subtractMoney } from "../src/domain/fees";
import { FEE_PERCENT, FEE_FIXED } from "../src/config/constants";
import Decimal from "decimal.js";

describe("domain/fees", () => {
  describe("calculateFeeFromGross", () => {
    test("calculates fee and net correctly for valid positive gross", () => {
      // 100 * 0.0175 + 0.50 = 2.25 fee. Net = 100 - 2.25 = 97.75
      const result = calculateFeeFromGross("100.00");
      expect(result.gross).toBe("100.0000");
      expect(result.fee).toBe("2.2500");
      expect(result.net).toBe("97.7500");
    });

    test("throws if gross is zero", () => {
      expect(() => calculateFeeFromGross("0.00")).toThrow("Gross amount must be positive");
    });

    test("throws if gross is negative", () => {
      expect(() => calculateFeeFromGross("-10.00")).toThrow("Gross amount must be positive");
    });

    test("throws if fee exceeds or equals gross amount", () => {
      // If gross is 0.50, fee = 0.50 * 0.0175 + 0.50 = 0.50875. Net < 0
      expect(() => calculateFeeFromGross("0.50")).toThrow("Fee exceeds or equals gross amount");
    });
  });

  describe("calculateGrossFromNet", () => {
    test("calculates gross and fee correctly for valid positive net", () => {
      // Net = 97.75
      // Gross = (97.75 + 0.50) / (1 - 0.0175) = 98.25 / 0.9825 = 100
      const result = calculateGrossFromNet("97.75");
      expect(result.gross).toBe("100.0000");
      expect(result.fee).toBe("2.2500");
      expect(result.net).toBe("97.7500");
    });

    test("throws if net is zero", () => {
      expect(() => calculateGrossFromNet("0.00")).toThrow("Net amount must be positive");
    });

    test("throws if net is negative", () => {
      expect(() => calculateGrossFromNet("-10.00")).toThrow("Net amount must be positive");
    });
  });

  describe("addMoney", () => {
    test("adds two amounts correctly", () => {
      expect(addMoney("10.50", "2.25")).toBe("12.7500");
      expect(addMoney("10.1234", "2.1234")).toBe("12.2468");
    });
  });

  describe("subtractMoney", () => {
    test("subtracts two amounts correctly", () => {
      expect(subtractMoney("10.50", "2.25")).toBe("8.2500");
      expect(subtractMoney("10.1234", "2.1234")).toBe("8.0000");
    });
  });
});
