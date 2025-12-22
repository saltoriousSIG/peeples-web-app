import { Address } from "viem";

export type TxStep = "idle" | "approving" | "buying";

export type AuctionState = {
  epochId: bigint | number;
  initPrice: bigint;
  startTime: bigint | number;
  paymentToken: Address;
  price: bigint;
  paymentTokenPrice: bigint;
  wethAccumulated: bigint;
  wethBalance: bigint;
  paymentTokenBalance: bigint;
};
