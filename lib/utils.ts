import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatUnits, formatEther } from "viem";
import { Strategy } from "@/types/pool.type";

export const DONUT_DECIMALS = 18;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTokenAmount = (
  value: bigint,
  decimals: number,
  maximumFractionDigits = 2
) => {
  if (value === 0n) return "0";
  const asNumber = Number(formatUnits(value, decimals));
  if (!Number.isFinite(asNumber)) {
    return formatUnits(value, decimals);
  }
  return asNumber.toLocaleString(undefined, {
    maximumFractionDigits,
  });
};


export const formatEth = (value: bigint, maximumFractionDigits = 4) => {
  if (value === 0n) return "0";
  const asNumber = Number(formatEther(value)) * 0.95;
  if (!Number.isFinite(asNumber)) {
    return formatEther(value);
  }
  return asNumber.toLocaleString(undefined, {
    maximumFractionDigits,
  });
};

export const HALVING_PERIOD = 30 * 24 * 60 * 60;

export const calculateNextHalving = (minerStartTime: number): number => {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - minerStartTime;
  const currentHalvingNumber = Math.floor(elapsed / HALVING_PERIOD);
  const nextHalvingNumber = currentHalvingNumber + 1;
  return minerStartTime + (nextHalvingNumber * HALVING_PERIOD);
};

export const calculateDutchAuctionPrice = (initPrice: bigint, startTime: number): bigint => {
  const EPOCH_DURATION = 3600n; // 1 hour in seconds (BigInt)
  const now = BigInt(Math.floor(Date.now() / 1000));
  const start = BigInt(startTime);
  const elapsed = now - start;

  if (elapsed >= EPOCH_DURATION) return 0n;
  if (elapsed < 0n) return initPrice; 

  // Solidity equivalent: 
  // decay = (EPOCH_DURATION - elapsed) * 1e18 / EPOCH_DURATION
  // price = (initPrice * decay) / 1e18
  
  const decay = ((EPOCH_DURATION - elapsed) * 1000000000000000000n) / EPOCH_DURATION;
  return (initPrice * decay) / 1000000000000000000n;
};


export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));



export const STRATEGY_MULTIPLIER: Record<Strategy, number> = {
  [Strategy.CONSERVATIVE]: 1.0,
  [Strategy.MODERATE]: 2.75,
  [Strategy.AGGRESSIVE]: 3.25,
  [Strategy.DEGEN]: 3.75,
};

export const DECAY_WINDOW = 60;
export const MAX_CAPITAL_RATIO = 1.1;

export function getBreakevenThreshold(
  glazePriceETH: number,
  poolBalanceETH: number,
  strategy: Strategy
): number {
  const capitalRatio = poolBalanceETH / glazePriceETH;
  const effectiveRatio =
    (STRATEGY_MULTIPLIER[strategy] * capitalRatio) / (capitalRatio + 1);

  return Math.floor(
    DECAY_WINDOW * effectiveRatio * STRATEGY_MULTIPLIER[strategy]
  );
}

