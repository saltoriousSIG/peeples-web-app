"use client";
import { useMiner } from "@/providers/MinerProvider";
import { formatTokenAmount, formatEth } from "@/lib/utils";
import { formatUnits, formatEther } from "viem";
import { useEthPrice } from "@/providers/PricesProvider";

const DONUT_DECIMALS = 18;
export function GlazeStats() {
  const { minerState } = useMiner();
  const { ethPrice: ethUsdPrice } = useEthPrice();

  const glazeRateDisplay = minerState
    ? formatTokenAmount(minerState.nextDps, DONUT_DECIMALS, 4)
    : "—";

  const glazeRateUsdValue =
    minerState && minerState.donutPrice > 0n && ethUsdPrice
      ? (
          Number(formatUnits(minerState.nextDps, DONUT_DECIMALS)) *
          Number(formatEther(minerState.donutPrice)) *
          ethUsdPrice
        ).toFixed(4)
      : "0.0000";

  const glazePriceDisplay = minerState
    ? `Ξ${formatEth(minerState.price, minerState.price === 0n ? 0 : 5)}`
    : "Ξ—";

  return (
    <div className="teal-gradient-card rounded-xl p-2 py-2 shadow-lg h-full flex flex-col justify-center">
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <h3 className="text-[14px] text-white/70 mb-0.5 uppercase">
            Glaze Rate
          </h3>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">🍩</span>
            <span className="text-lg font-bold text-white">
              {glazeRateDisplay}
            </span>
            <span className="text-[11px] text-white/70">/s</span>
          </div>
          <p className="text-[12px] text-white/70 mt-0.5">
            ${glazeRateUsdValue}/s
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-[12px] text-white/70 mb-0.5 uppercase">
            Glaze Price
          </h3>
          <div className="text-lg font-bold text-white">
            {glazePriceDisplay}
          </div>
          <p className="text-[12px] text-white/70 mt-0.5">
            $
            {minerState && ethUsdPrice
              ? (Number(formatEther(minerState.price)) * ethUsdPrice).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
