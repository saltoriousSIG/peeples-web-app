import { useState, useCallback, useMemo } from "react";
import { usePool } from "@/providers/PoolProvider";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { CONTRACT_ADDRESSES, ERC20 } from "@/lib/contracts";
import { base } from "wagmi/chains";

const SubmitBid = () => {
    const [bidAmount, setBidAmount] = useState("");
    const [feeRecipientAddress, setFeeRecipientAddress] = useState("");
    const { address } = useAccount();
    const { currentAuction, minAuctionBid, auctionBid } = usePool();
    const { data: userPeeplesBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.peeples,
        abi: ERC20,
        functionName: 'balanceOf',
        args: [address || zeroAddress],
        chainId: base.id
    })

    const bidValue = Number.parseFloat(bidAmount) || 0
    const isValidBid = bidValue >= parseFloat(formatUnits(minAuctionBid || 0n, 18))

    const handleBidSubmit = useCallback(async () => {
        if (!isValidBid) return alert("Invalid bid amount");
        if (!feeRecipientAddress || feeRecipientAddress.length !== 42) return alert("Invalid fee recipient address");
        try {
            await auctionBid(parseUnits(bidAmount || "0", 18), feeRecipientAddress as `0x${string}`);
        } catch (e: unknown) {
            console.error("Bid submission failed:", e);
        }
    }, [auctionBid, feeRecipientAddress, bidAmount, isValidBid]);


    const isAuctionActive = useMemo(() => {
        return currentAuction && currentAuction.highestBidder !== "0x0000000000000000000000000000000000000000"
    }, [currentAuction]);


    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#3D405B]/10 p-7 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-5">
                <div>
                    <label className="text-[10px] text-[#3D405B]/60 uppercase tracking-[0.12em] mb-2.5 block font-semibold">
                        Your Bid
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white text-black border-2 border-[#BC4B51]/20 rounded-xl px-5 py-4 text-lg placeholder:text-[#3D405B]/30 focus:outline-none focus:ring-4 focus:border-[#BC4B51] focus:ring-[#BC4B51]/10 transition-all tabular-nums font-semibold"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#3D405B]/40 font-semibold">
                            $PEEPLES
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-[#3D405B]/60 uppercase tracking-[0.12em] mb-2.5 block font-semibold">
                        Fee Recipient Address
                    </label>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={feeRecipientAddress}
                            onChange={(e) => setFeeRecipientAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-white text-black border-2 border-[#5C946E]/20 rounded-xl px-5 py-3 placeholder:text-[#3D405B]/30 focus:outline-none focus:ring-4 focus:border-[#5C946E] focus:ring-[#5C946E]/10 transition-all font-mono text-xs"
                        />
                        <button
                            onClick={() => {
                                setFeeRecipientAddress(address || "")
                            }}
                            className="text-xs text-[#5C946E] hover:text-[#5C946E]/80 font-semibold uppercase tracking-wider transition-colors"
                        >
                            Use Connected Wallet ({address?.slice(0, 6)}...{address?.slice(-4)})
                        </button>
                    </div>
                </div>

                <div className="pt-3 space-y-2.5 border-t border-[#3D405B]/5">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#3D405B]/50 font-medium">Your Balance</span>
                        <span className="font-bold text-[#3D405B] tabular-nums">{parseFloat(formatUnits(userPeeplesBalance || 0n, 18)).toLocaleString()} $PEEPLES</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#3D405B]/50 font-medium">Minimum Bid</span>
                        <span className="font-bold text-[#BC4B51] tabular-nums">{parseFloat(formatUnits(minAuctionBid || 0n, 18)).toLocaleString()} $PEEPLES</span>
                    </div>
                </div>

                <button
                    onClick={handleBidSubmit}
                    disabled={!isValidBid}
                    className="w-full bg-[#BC4B51] hover:bg-[#BC4B51]/90 text-white font-bold text-sm tracking-wide h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:bg-[#3D405B]/20 disabled:text-[#3D405B]/40 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {isAuctionActive
                        ? isValidBid
                            ? "PLACE BID"
                            : `Minimum ${parseFloat(formatUnits(minAuctionBid || 0n, 18)).toLocaleString()} $PEEPLES`
                        : isValidBid
                            ? "BE THE FIRST TO BID"
                            : "ENTER BID AMOUNT"}
                </button>
            </div>
        </div>
    );
}

export default SubmitBid;
