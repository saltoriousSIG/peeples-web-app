import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "Peeples Donuts",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Get one at https://cloud.walletconnect.com
  chains: [base],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL!),
  },
  ssr: false,
});
