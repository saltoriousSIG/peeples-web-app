import React, { useMemo } from "react";
import { Countdown } from "./countdown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatUnits, zeroAddress } from "viem";
import { usePool } from "@/providers/PoolProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const formatBidAmount = (amount: number): string => {
    if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(2)}B`
    }
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(2)}M`
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(2)}K`
    }
    return amount.toLocaleString()
}


const CurrentAuction = () => {
    const { currentAuction } = usePool();

    const { data: highestBidderData } = useQuery({
        queryKey: ['highestBidder', currentAuction?.highestBidder],
        enabled: !!currentAuction?.highestBidder && currentAuction.highestBidder !== zeroAddress,
        queryFn: async () => {
            // Replace with actual API call
            const { data: { user } } = await axios.get(`/api/neynar/user?address=${currentAuction?.highestBidder}`);
            return {
                avatar: user.pfpUrl,
                name: user.displayName,
                handle: user.username,
            };
        },
        staleTime: 60000, // 1 minute
    });
    const isAuctionActive = useMemo(() => {
        return currentAuction && currentAuction.highestBidder !== "0x0000000000000000000000000000000000000000"
    }, [currentAuction]);


    return (
        <>
            {isAuctionActive ? (
                // State: Auction Ongoing - Show current leader
                <div className="bg-gradient-to-br from-[#F4A259] to-[#BC4B51] rounded-2xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8" />

                    <div className="relative space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="px-2.5 py-1 rounded-full bg-white/30 backdrop-blur-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-white">Leading Bid</span>
                            </div>
                            <div className="text-sm text-white/90 font-semibold">
                                <Countdown endTime={Number(currentAuction?.endTime || 0) * 1000} /> left
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 ring-4 ring-white/40 flex-shrink-0">
                                <AvatarImage src={highestBidderData?.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-lg">{highestBidderData?.name[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="text-white text-base font-bold truncate">{highestBidderData?.name}</div>
                                <div className="text-white/80 text-sm truncate">{highestBidderData?.handle}</div>
                            </div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-3">
                            <div className="flex items-baseline justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="text-3xl font-bold text-white tabular-nums truncate">
                                        {formatBidAmount(Number.parseFloat(formatUnits(currentAuction?.highestBid || 0n, 18)))}
                                    </div>
                                    <div className="text-xs text-white/70 mt-0.5">{Number.parseFloat(formatUnits(currentAuction?.highestBid || 0n, 18)).toLocaleString()} $PEEPLES</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // State: No Bids Yet - Show open auction invitation
                <div className="bg-gradient-to-br from-[#F4A259] to-[#BC4B51] rounded-2xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8" />

                    <div className="relative space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="px-2.5 py-1 rounded-full bg-white/30 backdrop-blur-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-white">Auction Open</span>
                            </div>
                            <Countdown endTime={Number(currentAuction?.endTime || 0) * 1000} className="text-white/80 text-xs font-medium whitespace-nowrap" />
                        </div>

                        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 ring-4 ring-white/30">
                                <div className="text-4xl">🍩</div>
                            </div>

                            <div className="text-white text-2xl font-bold mb-2">No Bids Yet</div>
                            <div className="text-white/80 text-sm max-w-xs">
                                Be the first to bid and secure exclusive rights to 90% of protocol fees for 3 days
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CurrentAuction;  