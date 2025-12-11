"use client";
import axios from "axios";
import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

// Create context
interface EthPriceContextType {
  ethPrice: number | undefined;
  isLoading: boolean;
}

const EthPriceContext = createContext<EthPriceContextType>({
  ethPrice: undefined,
  isLoading: true,
});

export const useEthPrice = () => useContext(EthPriceContext);

export const EthPriceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      return data.ethereum.usd as number || 0;
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <EthPriceContext.Provider value={{ ethPrice: data, isLoading }}>
      {children}
    </EthPriceContext.Provider>
  );
};
