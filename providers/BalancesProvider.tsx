"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { CONTRACT_ADDRESSES, ERC20 } from "@/lib/contracts";

interface Balances {
  eth: number;
  donut: number;
  // add your tokens
  // donut: bigint;
  // glaze: bigint;
}

interface BalancesContextType {
  balances: Balances | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const BalancesContext = createContext<BalancesContextType>({
  balances: undefined,
  isLoading: true,
  refetch: () => {},
});

export const useBalances = () => useContext(BalancesContext);

export function BalancesProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["balances", address],
    queryFn: async (): Promise<Balances> => {
      if (!address) throw new Error("No address");

      return {
        eth: 0,
        donut: 0
      };
    },
    enabled: isConnected && !!address,
    refetchInterval: 30_000, // 30 seconds
    staleTime: 10_000,
  });

  return (
    <BalancesContext.Provider value={{ balances: data, isLoading, refetch }}>
      {children}
    </BalancesContext.Provider>
  );
}
