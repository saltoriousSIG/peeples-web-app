"use client";
import { useCallback, useRef } from "react";
import { useState } from "react";
import { useMiner } from "@/providers/MinerProvider";
import { base } from "viem/chains";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESSES, MULTICALL_ABI } from "@/lib/contracts";
import { Address } from "viem";


const toBigInt = (value: bigint | number) =>
  typeof value === "bigint" ? value : BigInt(value);

export function GlazeAction() {
  const [message, setMessage] = useState("");
  const { minerState } = useMiner();
  const { address } = useAccount();

  const {
    data: txHash,
    writeContract,
    isPending: isWriting,
    reset: resetWrite,
  } = useWriteContract();

  const { connectors, connectAsync, isPending: isConnecting } = useConnect();
  const primaryConnector = connectors[0];

  const [glazeResult, setGlazeResult] = useState<"success" | "failure" | null>(
    null
  );
  const glazeResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const resetGlazeResult = useCallback(() => {
    if (glazeResultTimeoutRef.current) {
      clearTimeout(glazeResultTimeoutRef.current);
      glazeResultTimeoutRef.current = null;
    }
    setGlazeResult(null);
  }, []);
  const showGlazeResult = useCallback((result: "success" | "failure") => {
    if (glazeResultTimeoutRef.current) {
      clearTimeout(glazeResultTimeoutRef.current);
    }
    setGlazeResult(result);
    glazeResultTimeoutRef.current = setTimeout(() => {
      setGlazeResult(null);
      glazeResultTimeoutRef.current = null;
    }, 3000);
  }, []);

  const handleGlaze = useCallback(async () => {
    if (!minerState) return;
    resetGlazeResult();
    try {
      let targetAddress = address;
      if (!targetAddress) {
        if (!primaryConnector) {
          throw new Error("Wallet connector not available yet.");
        }
        const result = await connectAsync({
          connector: primaryConnector,
          chainId: base.id,
        });
        targetAddress = result.accounts[0];
      }
      if (!targetAddress) {
        throw new Error("Unable to determine wallet address.");
      }
      const price = minerState.price;
      const epochId = toBigInt(minerState.epochId);
      const deadline = BigInt(
        Math.floor(Date.now() / 1000) + DEADLINE_BUFFER_SECONDS
      );
      const maxPrice = price === 0n ? 0n : (price * 105n) / 100n;
      writeContract({
        account: targetAddress as Address,
        address: CONTRACT_ADDRESSES.multicall as Address,
        abi: MULTICALL_ABI,
        functionName: "mine",
        args: [
          address as Address,
          epochId,
          deadline,
          maxPrice,
          message.trim(),
        ],
        value: price,
        chainId: base.id,
      });
    } catch (error) {
      console.error("Failed to glaze:", error);
      showGlazeResult("failure");
      resetWrite();
    }
  }, [
    address,
    connectAsync,
    message,
    minerState,
    primaryConnector,
    resetGlazeResult,
    resetWrite,
    showGlazeResult,
    writeContract,
  ]);

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm h-full flex flex-col">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a message (optional)"
        className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
      />

      <button 
        onClick={handleGlaze}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg">
        GLAZE
      </button>
    </div>
  );
}
