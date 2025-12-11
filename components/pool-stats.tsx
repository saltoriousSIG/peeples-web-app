"use client";
import { useMemo } from "react";
import { usePool } from "@/providers/PoolProvider";
import { formatUnits } from "viem";
import { useEthPrice } from "@/providers/PricesProvider";
import { useMiner } from "@/providers/MinerProvider";

export function PoolStats() {
  const { tvl, state, shareTokenBalance, shareTokenTotalSupply } = usePool();
  const { ethPrice } = useEthPrice();
  const { minerState } = useMiner();

  const { wethUsdValue, donutUsdValue } = useMemo(() => {
    if (!ethPrice || !minerState || !tvl) {
      return { wethUsdValue: "0", donutUsdValue: "0" };
    }
    return {
      wethUsdValue: (
        parseFloat(formatUnits(tvl?.wethTVL || 0n, 18)) * ethPrice
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      donutUsdValue: (
        parseFloat(formatUnits(tvl.donutTVL, 18)) *
        parseFloat(formatUnits(minerState?.donutPrice || 0n, 18)) *
        ethPrice
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  }, [ethPrice, minerState, tvl]);

  return (
    <div className="bakery-card rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-white">Family Pool</h2>
        <span className="text-xs text-white/70 italic">
          Pool together, earn together
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-white/70 uppercase">TVL</p>

          <div className="text-xl font-bold text-white tabular-nums tracking-tight group-hover:text-[#F4A259] transition-colors whitespace-nowrap">
            {parseFloat(formatUnits(tvl?.wethTVL || 0n, 18)).toFixed(4)}{" "}
            <span className="text-base">$WETH</span>
          </div>
          <div className="text-sm text-white tabular-nums">${wethUsdValue}</div>
          <div className="text-xl font-bold text-white tabular-nums tracking-tight group-hover:text-[#F4A259] transition-colors whitespace-nowrap">
            {parseFloat(formatUnits(tvl?.donutTVL || 0n, 18)).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}{" "}
            <span className="text-base">$DONUT</span>
          </div>
          <div className="text-sm text-white tabular-nums">
            ${donutUsdValue}
          </div>
        </div>
        <div>
          <div>
            <p className="text-xs text-white/70 uppercase">Bakers</p>
            <p className="text-lg font-bold text-white">
              {state?.numPoolParticipants}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/70 uppercase">Your Share</p>
            <p className="text-lg font-bold text-amber-200">
              {shareTokenBalance && shareTokenTotalSupply
                ? `${((parseFloat(shareTokenBalance.toString()) / parseFloat(shareTokenTotalSupply.toString())) * 100).toFixed(2)}%`
                : `0%`}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center">
        <div>
          <p className="text-xs text-white/70">Pool Value</p>
          <p className="text-base font-bold text-white">
            ${(
              parseFloat(wethUsdValue.replace(/,/g, "")) +
              parseFloat(donutUsdValue.replace(/,/g, ""))
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
