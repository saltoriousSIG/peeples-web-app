"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { MinerProvider } from "./MinerProvider";
import { PoolProvider } from "./PoolProvider";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "../wagmi.config";

import "@rainbow-me/rainbowkit/styles.css";
import { EthPriceProvider } from "./PricesProvider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#ec4899",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
          })}
        >
          <EthPriceProvider>
            <MinerProvider>
              <PoolProvider>
                <div>{children}</div>
              </PoolProvider>
            </MinerProvider>
          </EthPriceProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
