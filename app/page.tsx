import { Header } from "@/components/header";
import { PoolStats } from "@/components/pool-stats";
import { PoolActions } from "@/components/pool-actions";
import { PoolReward } from "@/components/pool-reward";
import { VideoFeed } from "@/components/video-feed";
import { GlazeStats } from "@/components/glaze-stats";
import { GlazeAction } from "@/components/glaze-action";
import { GlobalMetrics } from "@/components/global-metrics";
import { UserBalances } from "@/components/user-balances";
import { KingGlazer } from "@/components/king-glazer";
import { Bakers } from "@/components/bakers";

export default function Home({ethPrice}: {ethPrice: number}) {
  console.log(ethPrice, "eth price")
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[380px_1fr_380px] gap-3 p-3 max-w-[1800px] mx-auto w-full overflow-auto">
        <div className="flex flex-col-reverse lg:flex-col gap-3 md:col-span-2 lg:col-span-1 order-2 lg:order-1">
          <PoolStats />
          <PoolActions />
          <PoolReward />
        </div>

        <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1 order-1 lg:order-2">
          <VideoFeed />
          <KingGlazer />
          <div className="flex flex-col gap-3">
            <GlazeStats />
            <GlazeAction />
            <UserBalances />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1 order-3">
          <GlobalMetrics />
          <Bakers />
        </div>
      </main>
    </div>
  );
}
