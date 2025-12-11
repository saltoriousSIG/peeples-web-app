"use client"
import { createContext, useContext, ReactNode } from 'react';
import { CONTRACT_ADDRESSES, MULTICALL_ABI } from '@/lib/contracts';
import { zeroAddress } from "viem";
import { base } from "wagmi/chains";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { MinerState, Slot0 } from '@/types/miner.type';

interface MinerContextType {
  // TODO: Add context values
  minerState: MinerState | undefined;
}

const MinerContext = createContext<MinerContextType | undefined>(undefined);

export function MinerProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  const { data: rawMinerState, refetch: refetchMinerState } = useReadContract({
    address: CONTRACT_ADDRESSES.multicall,
    abi: MULTICALL_ABI,
    functionName: "getMiner",
    args: [address ?? zeroAddress],
    chainId: base.id,
    query: {
      refetchInterval: 3_000,
    },
  });

  const value: MinerContextType = {
    minerState: rawMinerState as MinerState | undefined,
  };

  return (
    <MinerContext.Provider value={value}>
      {children}
    </MinerContext.Provider>
  );
}

export function useMiner() {
  const context = useContext(MinerContext);
  if (context === undefined) {
    throw new Error('useMiner must be used within a MinerProvider');
  }
  return context;
}
