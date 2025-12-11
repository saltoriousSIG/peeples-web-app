"use client";
import { fetchGraphData } from "@/lib/fetchGraphData";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMiner } from "@/providers/MinerProvider";
import { ethers } from "ethers";
import { useEthPrice } from "@/providers/PricesProvider";
import { calculateNextHalving } from "@/lib/utils";

export function GlobalMetrics() {
  const { minerState } = useMiner();
  const { ethPrice } = useEthPrice();

  const [halvingTime, setHalvingTime] = useState<string>("");
  const [nextHalvingTime, setNextHalvingTime] = useState<number | null>(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["global-stats"],
    queryFn: async () => {
      const data = await fetchGraphData();
      console.log(data, "global stats");
      return data;
    },
    refetchInterval: 10 * 60 * 1000, // 5 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const safeDonutPrice = minerState?.donutPrice
    ? BigInt(minerState.donutPrice)
    : 0n;
  const donutPriceEth = parseFloat(ethers.formatEther(safeDonutPrice));
  const donutPriceUsd = ethPrice ? donutPriceEth * ethPrice : 0;

  useEffect(() => {
    const loadHalvingData = async () => {
      if (minerState?.startTime) {
        console.log(minerState.startTime)
        const nextHalving = calculateNextHalving(minerState.startTime);
        setNextHalvingTime(nextHalving);
      }
    };
    loadHalvingData();
  }, [minerState]);

  useEffect(() => {
    const timer = setInterval(() => {

      // Update Halving Countdown
      if (nextHalvingTime) {
        const diff = nextHalvingTime * 1000 - Date.now(); // Convert to ms
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setHalvingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setHalvingTime("HALVING NOW");
        }
      }
    }, 100);
    return () => clearInterval(timer);
  }, [minerState?.initPrice, minerState?.startTime, nextHalvingTime]);

  return (
    <div className="bg-card rounded-xl p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-muted-foreground mb-3">
        Global Stats
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-muted-foreground">TOTAL MINED</p>
            <div className="flex items-center gap-1">
              <span>🍩</span>
              <span className="text-lg font-bold">
                {parseInt(stats?.miners[0].minted).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">DONUT PRICE</p>
            <span className="text-lg font-bold">
              ${donutPriceUsd.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="teal-gradient-card rounded-lg p-3">
          <p className="text-[10px] text-white/70 mb-0.5">NEXT HALVING</p>
          <span className="text-base font-bold text-white">
            {halvingTime || "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}
