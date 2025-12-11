"use client";
import { useMiner } from "@/providers/MinerProvider";
import { formatTokenAmount, DONUT_DECIMALS, formatEth } from "@/lib/utils";
export function UserBalances() {
  const { minerState } = useMiner();

  const donutBalanceDisplay =
    minerState && minerState.donutBalance !== undefined
      ? formatTokenAmount(minerState.donutBalance, DONUT_DECIMALS, 2)
      : "—";
  const ethBalanceDisplay =
    minerState && minerState.ethBalance !== undefined
      ? formatEth(minerState.ethBalance, 4)
      : "—";
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
        Your Balances
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase">
            Donuts
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-base">🍩</span>
            <span className="text-lg font-bold">{donutBalanceDisplay}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase">
            ETH
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm text-muted-foreground">Ξ</span>
            <span className="text-lg font-bold">{ethBalanceDisplay}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase">
            WETH
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm text-muted-foreground">wΞ</span>
            <span className="text-lg font-bold">
              {minerState && minerState.wethBalance !== undefined
                ? formatEth(minerState.wethBalance, 4)
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
