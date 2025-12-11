"use client";
import { Crown, TrendingUp } from "lucide-react";
import { usePool } from "@/providers/PoolProvider";
import { useCanBuyGlaze } from "@/hooks/useCanBuy";
import { formatUnits } from "viem";

export function PoolReward() {
  const { canBuy, currentBreakEven, targetBreakEven } = useCanBuyGlaze();
  const { config, buyKingGlazer, state } = usePool();

  if (state?.isActive) {
    return (
      <div className="bg-gradient-to-br from-[#5C946E] via-[#4ECDC4] to-[#5C946E] rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-4 -mb-4" />

        <div className="relative space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="inline-block px-2 py-0.5 rounded bg-white/25 mb-1.5">
                <span className="text-[9px] font-bold text-white tracking-widest">
                  KING GLAZER
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                The Pool Wears the Crown
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Earning <span className="font-bold">$DONUT</span> for all pool
                members
              </p>
            </div>

            <div className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider border bg-white/30 text-white border-white/40 flex-shrink-0 animate-pulse">
              REIGNING
            </div>
          </div>

          <p className="text-[10px] text-white/70 leading-relaxed px-1">
            Hold the crown as long as possible to maximize pool rewards. Another
            buyer can take it anytime!
          </p>

          <div className="w-full bg-white/20 text-white font-bold text-sm tracking-wide h-10 rounded-lg flex items-center justify-center">
            DEFENDING THE CROWN
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl p-3 shadow-lg bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Crown className="w-3 h-3 text-amber-700" />
          <span className="text-[10px] font-semibold text-amber-800 uppercase">
            Pool Reward
          </span>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${canBuy ? "bg-green-500/20 text-green-800" : "bg-gray-400/30 text-gray-600"}`}
        >
          {canBuy ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      <h3 className="text-sm font-bold text-amber-900 mb-1">
        Buy King Glazer for Pool
      </h3>
      <div className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
        +
        {parseFloat(
          formatUnits(config?.reward?.peeplesReward || 0n, 18)
        ).toFixed(0)}{" "}
        $PEEPLES
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-2 mb-2">
        <div className="flex items-center justify-between text-center">
          <div>
            <div className="text-[10px] text-amber-800/70">CURRENT</div>
            <div className="text-lg font-bold text-amber-900">
              {currentBreakEven}m
            </div>
          </div>
          <div className="text-amber-700 font-bold">≤</div>
          <div>
            <div className="text-[10px] text-amber-800/70">THRESHOLD</div>
            <div className="text-lg font-bold text-amber-900">
              {targetBreakEven}m
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={async () => {
          await buyKingGlazer();
        }}
        disabled={!canBuy}
        className={`w-full py-2 rounded-lg font-semibold text-xs transition-all ${
          canBuy
            ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
            : "bg-orange-300/50 text-orange-800/50 cursor-not-allowed"
        }`}
      >
        {canBuy ? (
          <span className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trigger Purchase
          </span>
        ) : (
          "WAITING FOR CONDITIONS"
        )}
      </button>
    </div>
  );
}
