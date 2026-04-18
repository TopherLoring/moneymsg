import Decimal from "decimal.js";
import { FEE_FIXED, FEE_PERCENT } from "../../config/constants";

Decimal.set({ precision: 40 });

const SCALE = 4;

const money = (value: Decimal) => value.toDecimalPlaces(SCALE, Decimal.ROUND_HALF_UP).toFixed(SCALE);

export function calculateFeeFromGross(grossAmount: string) {
  const gross = new Decimal(grossAmount);
  if (gross.lte(0)) throw new Error("Gross amount must be positive");

  const fee = gross.mul(FEE_PERCENT).add(FEE_FIXED);
  const net = gross.minus(fee);

  if (net.lte(0)) throw new Error("Fee exceeds or equals gross amount");

  return {
    gross: money(gross),
    fee: money(fee),
    net: money(net),
  };
}

export function calculateGrossFromNet(targetNet: string) {
  const net = new Decimal(targetNet);
  if (net.lte(0)) throw new Error("Net amount must be positive");

  const percent = new Decimal(1).minus(FEE_PERCENT);
  const gross = net.add(FEE_FIXED).div(percent);
  const fee = gross.minus(net);

  return {
    gross: money(gross),
    fee: money(fee),
    net: money(net),
  };
}

export function addMoney(a: string, b: string) {
  return money(new Decimal(a).add(b));
}

export function subtractMoney(a: string, b: string) {
  return money(new Decimal(a).minus(b));
}
