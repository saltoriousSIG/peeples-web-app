"use client";
import { useEffect, useState } from "react";
import { useMiner } from "@/providers/MinerProvider";
import { Crown } from "lucide-react";
import { formatUnits, formatEther } from "viem";
import { useEthPrice } from "@/providers/PricesProvider";
import { cn, formatTokenAmount, DONUT_DECIMALS, formatEth } from "@/lib/utils";

const formatGlazeTime = (seconds: number): string => {
  if (seconds < 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export function KingGlazer() {
  const { minerState } = useMiner();
  const { ethPrice: ethUsdPrice } = useEthPrice();

  const [glazeElapsedSeconds, setGlazeElapsedSeconds] = useState(0);
  const [interpolatedGlazed, setInterpolatedGlazed] = useState<bigint | null>(
    null
  );

  useEffect(() => {
    if (!minerState) {
      setGlazeElapsedSeconds(0);
      return;
    }

    // Calculate initial elapsed time
    const startTimeSeconds = Number(minerState.startTime);
    const initialElapsed = Math.floor(Date.now() / 1000) - startTimeSeconds;
    setGlazeElapsedSeconds(initialElapsed);

    // Update every second
    const interval = setInterval(() => {
      const currentElapsed = Math.floor(Date.now() / 1000) - startTimeSeconds;
      setGlazeElapsedSeconds(currentElapsed);
    }, 1_000);

    return () => clearInterval(interval);
  }, [minerState]);

  useEffect(() => {
    if (!minerState) {
      setInterpolatedGlazed(null);
      return;
    }

    // Start with the fetched value
    setInterpolatedGlazed(minerState.glazed);

    // Update every second with interpolated value
    const interval = setInterval(() => {
      if (minerState.nextDps > 0n) {
        setInterpolatedGlazed((prev) => {
          if (!prev) return minerState.glazed;
          return prev + minerState.nextDps;
        });
      }
    }, 1_000);

    return () => clearInterval(interval);
  }, [minerState]);

  const glazedDisplay =
    minerState && interpolatedGlazed !== null
      ? `🍩${formatTokenAmount(interpolatedGlazed, DONUT_DECIMALS, 2)}`
      : "🍩—";

  const glazedUsdValue =
    minerState &&
    minerState.donutPrice > 0n &&
    interpolatedGlazed !== null &&
    ethUsdPrice
      ? (
          Number(formatEther(interpolatedGlazed)) *
          Number(formatEther(minerState.donutPrice)) *
          ethUsdPrice
        ).toFixed(2)
      : "0.00";

  const pnlUsdValue =
    minerState && ethUsdPrice
      ? (() => {
          const halfInitPrice = minerState.initPrice / 2n;
          const pnl =
            minerState.price < minerState.initPrice
              ? (minerState.price * 80n) / 100n - halfInitPrice
              : minerState.price - halfInitPrice;
          const pnlEth = Number(formatEther(pnl >= 0n ? pnl : -pnl));
          const pnlUsd = pnlEth * ethUsdPrice;
          const sign = pnl >= 0n ? "+" : "-";
          return `${sign}$${pnlUsd.toFixed(2)}`;
        })()
      : "$0.00";
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-3 shadow-sm border border-amber-200/50 dark:border-amber-800/50">
      {/* Top row: King info and time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
            <Crown className="w-4 h-4 text-amber-950" fill="currentColor" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide leading-tight">
              King Glazer
            </div>
            <div className="text-sm font-mono font-bold text-foreground">
              {minerState?.miner &&
                `${minerState.miner.substring(0, 5)}...${minerState.miner.substring(minerState.miner.length - 5, minerState.miner.length)}`}
            </div>
            <div className="flex items-baseline justify-center gap-x-1.5">
              <div>
                Purchased for:
              </div>
              <div className="text-[14px] text-gray-600 whitespace-nowrap">
                {parseFloat(
                  formatUnits((minerState?.initPrice || 0n) / 2n, 18)
                ).toFixed(5)}{" "}
                $ETH
              </div>
              <div className="text-[12px] text-gray-600 whitespace-nowrap">
                ($
                {minerState && ethUsdPrice
                  ? (
                      Number(formatEther(minerState.initPrice / 2n)) *
                      ethUsdPrice
                    ).toFixed(2)
                  : "0.00"}
                )
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[12px] text-muted-foreground uppercase leading-tight">
            Time
          </div>
          <div className="text-sm font-semibold text-foreground">
            {formatGlazeTime(glazeElapsedSeconds)}
          </div>
        </div>
      </div>

      {/* Bottom row: Stats grid */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-amber-200/50 dark:border-amber-800/50">
        <div className="text-center">
          <div className="text-[12px] text-muted-foreground uppercase leading-tight mb-0.5">
            Glazed
          </div>
          <div className="text-base font-bold text-foreground">
            {glazedDisplay}
          </div>
          <div className="text-[12px] text-muted-foreground">
            ${glazedUsdValue}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[12px] text-muted-foreground uppercase leading-tight mb-0.5">
            PNL
          </div>

          <div
            className={cn(
              "text-[12px] font-semibold",
              minerState &&
                (() => {
                  const halfInitPrice = minerState.initPrice / 2n;
                  const pnl =
                    minerState.price < minerState.initPrice
                      ? (minerState.price * 80n) / 100n - halfInitPrice
                      : minerState.price - halfInitPrice;
                  return pnl >= 0n;
                })()
                ? "text-green-400"
                : "text-red-400"
            )}
          >
            {minerState
              ? (() => {
                  const halfInitPrice = minerState.initPrice / 2n;
                  const pnl =
                    minerState.price < minerState.initPrice
                      ? (minerState.price * 80n) / 100n - halfInitPrice
                      : minerState.price - halfInitPrice;
                  const sign = pnl >= 0n ? "+" : "-";
                  const absolutePnl = pnl >= 0n ? pnl : -pnl;
                  return `${sign}Ξ${formatEth(absolutePnl, 5)}`;
                })()
              : "Ξ—"}
          </div>
          <div className="text-[12px] text-gray-600">{pnlUsdValue}</div>
        </div>
        <div className="text-center flex flex-center justify-center flex-col">
          <div className="text-[12px] text-muted-foreground uppercase leading-tight mb-0.5">
            Total PNL
          </div>
          <div
            className={cn(
              "text-[12px] font-semibold",
              glazedUsdValue &&
                pnlUsdValue &&
                (() => {
                  const totalPnl =
                    parseFloat(glazedUsdValue) +
                    parseFloat(pnlUsdValue.replace(/[$+,-]/g, "")) *
                      (pnlUsdValue.startsWith("-") ? -1 : 1);
                  return totalPnl >= 0;
                })()
                ? "text-green-400"
                : "text-red-400"
            )}
          >
            <span className="pb-0.5">
              {(() => {
                const totalPnl =
                  parseFloat(glazedUsdValue) +
                  parseFloat(pnlUsdValue.replace(/[$+,-]/g, "")) *
                    (pnlUsdValue.startsWith("-") ? -1 : 1);
                return totalPnl >= 0 ? "+" : "-";
              })()}{" "}
            </span>
            <span>$ </span>
            <span>
              {Math.abs(
                parseFloat(glazedUsdValue) +
                  parseFloat(pnlUsdValue.replace(/[$+,-]/g, "")) *
                    (pnlUsdValue.startsWith("-") ? -1 : 1)
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
