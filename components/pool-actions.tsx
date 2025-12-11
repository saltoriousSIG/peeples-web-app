"use client";
import { usePool } from "@/providers/PoolProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { formatUnits, parseUnits } from "viem";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, DATA } from "@/lib/contracts";
import { base } from "wagmi/chains";

export function PoolActions() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const { wethBalance, shareTokenBalance, deposit, withdraw, config } =
    usePool();

  const { data: withdrawalAmounts, refetch: refetchPoolState } =
    useReadContract({
      address: CONTRACT_ADDRESSES.pool,
      abi: DATA,
      functionName: "calculateWithdrawalAmounts",
      args: [shareTokenBalance as bigint],
      chainId: base.id,
    });

  return (
    <div className="bg-white/90 rounded-xl p-2 shadow-sm border border-border/30">
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setMode("deposit")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            mode === "deposit"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setMode("withdraw")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            mode === "withdraw"
              ? "bg-destructive text-destructive-foreground"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          Withdraw
        </button>
      </div>

      <div className="bg-muted/50 rounded-lg p-2 mb-2 border border-border/30">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[12px] text-muted-foreground">You {mode}</span>
          <div className="flex gap-1">
            {["25%", "50%", "MAX"].map((pct) => (
              <button
                key={pct}
                onClick={() => {
                  const balance =
                    mode === "deposit" ? wethBalance : shareTokenBalance;
                  if (!balance) {
                    return setAmount("0");
                  }
                  if (pct === "MAX") {
                    setAmount(
                      balance
                        ? parseFloat(formatUnits(balance, 18)).toString()
                        : "0"
                    );
                    return;
                  }
                  let val = 0;
                  if (pct === "25%") {
                    val = parseFloat(formatUnits(balance, 18)) * 0.25;
                  } else if (pct === "50%") {
                    val = parseFloat(formatUnits(balance, 18)) * 0.5;
                  }
                  setAmount(val.toFixed(4));
                }}
                className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                {pct}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/40 min-w-0"
          />
          <button className="flex items-center gap-1 bg-white rounded-full pl-1 pr-1.5 py-0.5 shadow-sm border border-border/50 text-[12px] shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400" />
            <span className="font-semibold">
              {mode === "deposit" ? "wETH" : "SPEEP"}
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
          </button>
        </div>

        <div className="pt-3 space-y-2.5 border-t border-[#3D405B]/5">
          {mode === "deposit" ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-[#3D405B]/50 font-medium">
                  Available Balance
                </span>
                <span className="font-bold text-[#3D405B] tabular-nums">
                  {parseFloat(formatUnits(wethBalance ?? 0n, 18)).toFixed(4)}{" "}
                  $WETH
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#3D405B]/50 font-medium">
                  Min. Deposit
                </span>
                <span className="font-bold text-[#3D405B] tabular-nums">
                  {config
                    ? parseFloat(formatUnits(config.minDeposit, 18)).toFixed(4)
                    : "0"}{" "}
                  $WETH
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-[#3D405B]/50 font-medium">
                  Your Shares
                </span>
                <span className="font-bold text-[#3D405B] tabular-nums">
                  {parseFloat(formatUnits(shareTokenBalance ?? 0n, 18)).toFixed(
                    4
                  )}{" "}
                  $SPEEP
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#3D405B]/50 font-medium">
                  Earned Rewards
                </span>
                <span className="font-bold text-[#5C946E] tabular-nums">
                  {withdrawalAmounts
                    ? `${parseFloat(formatUnits(withdrawalAmounts.wethOut, 18)).toFixed(4)} $WETH + ${parseFloat(formatUnits(withdrawalAmounts.donutOut, 18)).toFixed(2)} $DONUT`
                    : "0 $WETH + 0 $DONUT "}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <Button
        onClick={async () => {
          if (mode === "deposit") {
            await deposit(parseInt(parseUnits(amount || "0", 18).toString()));
          } else if (mode === "withdraw") {
            withdraw(parseInt(parseUnits(amount || "0", 18).toString()));
          }
        }}
        className={`w-full h-8 rounded-lg font-bold text-xs transition-all ${
          mode === "deposit"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        }`}
      >
        {mode === "deposit" ? "Join the Family" : "Withdraw"}
      </Button>
    </div>
  );
}
