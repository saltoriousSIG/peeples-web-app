export interface MinerState {
  epochId: number;
  initPrice: bigint;
  startTime: number;
  glazed: bigint;
  price: bigint;
  dps: bigint;
  nextDps: bigint;
  donutPrice: bigint; // Added back to match ABI
  miner: string;
  uri: string;
  ethBalance: bigint;
  donutBalance: bigint;
  wethBalance: bigint;
}

export interface Slot0 {
  locked: boolean;
  epochId: number;
  initPrice: bigint;
  startTime: number;
  dps: bigint; // Donuts per second in wei
  miner: string;
  uri: string;
}
