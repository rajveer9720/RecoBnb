import { ethers } from "ethers";

export const formatFromWei = (
  value: bigint | string,
  decimals: number = 18,
): string => {
  const formatted = ethers.formatUnits(value, decimals);
  return parseFloat(formatted).toFixed(4);
};

export const parseToWei = (value: string, decimals: number = 18): bigint => {
  return ethers.parseUnits(value, decimals);
};

export const formatDecimal = (
  value: number | string,
  decimals: number = 4,
): string => {
  return parseFloat(value.toString()).toFixed(decimals);
};
