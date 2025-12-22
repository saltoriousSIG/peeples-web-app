"use client"
import { Header } from "@/components/header"
import { Flame } from "lucide-react"
import HeadBaker from "@/components/head-baker"
import CurrentAuction from "@/components/current-auction"
import SubmitBid from "@/components/submit-bid"
import DonutEthBlazery from "@/components/donut-eth-blazery"
import DonutPeeplesBlazery from "@/components/donut-peeples-blazery"

export default function BlazeryPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6">
                {/* Current Operator Banner */}
                <HeadBaker />

                {/* Auction Card */}
                <CurrentAuction />


                {/* Bidding Section */}
                <SubmitBid />


                {/* What You Win */}
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h2 className="text-2xl font-bold mb-6">What You Win</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center flex-shrink-0 border-2 border-amber-200 dark:border-amber-800">
                                <span className="text-amber-600 dark:text-amber-400 font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">90% of Protocol Fees</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Earn $DONUT and $WETH from all pool fees generated for 3 consecutive days
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center flex-shrink-0 border-2 border-teal-200 dark:border-teal-800">
                                <span className="text-teal-600 dark:text-teal-400 font-bold">2</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">3-Day Exclusive Rights</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Rights begin immediately after auction ends and last exactly three days
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center flex-shrink-0 border-2 border-rose-200 dark:border-rose-800">
                                <span className="text-rose-600 dark:text-rose-400 font-bold">3</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Blazery Boost</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Your bid + 10% of fees flow into blazery, increasing PEEPLES/DONUT LP burn value for everyone
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blazery Pools */}
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                        <Flame className="w-6 h-6 text-orange-500" />
                        DONUT-ETH Blazery
                    </h2>
                    <DonutEthBlazery />
                </div>


                {/* DONUT-PEEPLES Blazery */}
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                        <Flame className="w-6 h-6 text-orange-500" />
                        DONUT-PEEPLES Blazery
                    </h2>
                    <DonutPeeplesBlazery />
                </div>
            </main>
        </div>
    )
}
