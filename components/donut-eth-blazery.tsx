import React, { useState, useRef, useMemo, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { formatEther, zeroAddress } from "viem";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, MULTICALL_ABI, ERC20 } from "@/lib/contracts";
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
import { Address } from "viem";
import { useEthPrice } from "@/providers/PricesProvider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { AuctionState, TxStep } from "@/types/blazery.type";



const DEADLINE_BUFFER_SECONDS = 5 * 60;

const LP_TOKEN_ADDRESS =
    "0xD1DbB2E56533C55C3A637D13C53aeEf65c5D5703" as Address;

const formatEth = (value: bigint, maximumFractionDigits = 4) => {
    if (value === 0n) return "0";
    const asNumber = Number(formatEther(value));
    if (!Number.isFinite(asNumber)) {
        return formatEther(value);
    }
    return asNumber.toLocaleString(undefined, {
        maximumFractionDigits,
    });
};

const toBigInt = (value: bigint | number) =>
    typeof value === "bigint" ? value : BigInt(value);


const DonutEthBlazery = () => {
    const [donutEthBlazeResult, setDonutEthBlazeResult] = useState<"success" | "failure" | null>(null);
    const [donutEthTxStep, setDonutEthTxStep] = useState<TxStep>("idle");
    const donutEthResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { address } = useAccount();
    const { connectors, connectAsync, isPending: isConnecting } = useConnect();
    const primaryConnector = connectors[0];
    const { ethPrice: ethUsdPrice = 0 } = useEthPrice();

    const { data: rawAuctionState, refetch: refetchAuctionState } =
        useReadContract({
            address: CONTRACT_ADDRESSES.multicall,
            abi: MULTICALL_ABI,
            functionName: "getAuction",
            args: [address ?? zeroAddress],
            chainId: base.id,
            query: {
                refetchInterval: 3_000,
            },
        });

    const {
        data: donutEthTxHash,
        writeContract: writeDonutEthContract,
        isPending: isDonutEthWriting,
        isError: isDonutEthError,
        reset: resetDonutEthWrite,
    } = useWriteContract();

    const { data: donutEthReceipt, isLoading: isDonutEthConfirming } =
        useWaitForTransactionReceipt({
            hash: donutEthTxHash,
            chainId: base.id,
        });


    const auctionState = useMemo(() => {
        if (!rawAuctionState) return undefined;
        return rawAuctionState as unknown as AuctionState;
    }, [rawAuctionState]);

    const auctionPriceDisplay = auctionState
        ? formatEth(auctionState.price, auctionState.price === 0n ? 0 : 5)
        : "—";

    const claimableDisplay = auctionState
        ? formatEth(auctionState.wethAccumulated, 8)
        : "—";

    const blazeProfitLoss = useMemo(() => {
        if (!auctionState) return null;

        const lpValueInEth =
            Number(formatEther(auctionState.price)) *
            Number(formatEther(auctionState.paymentTokenPrice));
        const lpValueInUsd = lpValueInEth * ethUsdPrice;

        const wethReceivedInEth = Number(formatEther(auctionState.wethAccumulated));
        const wethValueInUsd = wethReceivedInEth * ethUsdPrice;

        const profitLoss = wethValueInUsd - lpValueInUsd;
        const isProfitable = profitLoss > 0;

        return {
            profitLoss,
            isProfitable,
            lpValueInUsd,
            wethValueInUsd,
        };
    }, [auctionState, ethUsdPrice]);

    const showDonutEthBlazeResult = useCallback((result: "success" | "failure") => {
        if (donutEthResultTimeoutRef.current) {
            clearTimeout(donutEthResultTimeoutRef.current);
        }
        setDonutEthBlazeResult(result);
        donutEthResultTimeoutRef.current = setTimeout(() => {
            setDonutEthBlazeResult(null);
            donutEthResultTimeoutRef.current = null;
        }, 3000);
    }, []);

    const resetDonutEthBlazeResult = useCallback(() => {
        if (donutEthResultTimeoutRef.current) {
            clearTimeout(donutEthResultTimeoutRef.current);
            donutEthResultTimeoutRef.current = null;
        }
        setDonutEthBlazeResult(null);
    }, []);

    const handleBlaze = useCallback(async () => {
        if (!auctionState) return;
        resetDonutEthBlazeResult();
        try {
            let targetAddress = address;
            if (!targetAddress) {
                if (!primaryConnector) {
                    throw new Error("Wallet connector not available yet.");
                }
                const result = await connectAsync({
                    connector: primaryConnector,
                    chainId: base.id,
                });
                targetAddress = result.accounts[0];
            }
            if (!targetAddress) {
                throw new Error("Unable to determine wallet address.");
            }

            const price = auctionState.price;
            const epochId = toBigInt(auctionState.epochId);
            const deadline = BigInt(
                Math.floor(Date.now() / 1000) + DEADLINE_BUFFER_SECONDS
            );
            const maxPaymentTokenAmount = price;

            if (donutEthTxStep === "idle") {
                setDonutEthTxStep("approving");
                writeDonutEthContract({
                    account: targetAddress as Address,
                    address: LP_TOKEN_ADDRESS,
                    abi: ERC20,
                    functionName: "approve",
                    args: [CONTRACT_ADDRESSES.multicall as Address, price],
                    chainId: base.id,
                });
                return;
            }

            if (donutEthTxStep === "buying") {
                writeDonutEthContract({
                    account: targetAddress as Address,
                    address: CONTRACT_ADDRESSES.multicall as Address,
                    abi: MULTICALL_ABI,
                    functionName: "buy",
                    args: [epochId, deadline, maxPaymentTokenAmount],
                    chainId: base.id,
                });
            }
        } catch (error) {
            console.error("Failed to blaze:", error);
            showDonutEthBlazeResult("failure");
            setDonutEthTxStep("idle");
            resetDonutEthWrite();
        }
    }, [
        address,
        connectAsync,
        auctionState,
        primaryConnector,
        donutEthTxStep,
        resetDonutEthBlazeResult,
        resetDonutEthWrite,
        showDonutEthBlazeResult,
        writeDonutEthContract,
    ]);

    const donutEthButtonLabel = useMemo(() => {
        if (!auctionState) return "Loading…";
        if (donutEthBlazeResult === "success") return "SUCCESS";
        if (donutEthBlazeResult === "failure") return "FAILURE";
        if (isDonutEthWriting || isDonutEthConfirming) {
            if (donutEthTxStep === "approving") return "APPROVING…";
            if (donutEthTxStep === "buying") return "BLAZING…";
            return "PROCESSING…";
        }
        return "BLAZE";
    }, [donutEthBlazeResult, isDonutEthConfirming, isDonutEthWriting, auctionState, donutEthTxStep]);

    const hasInsufficientLP =
        auctionState && auctionState.paymentTokenBalance < auctionState.price;

    const isBlazeDisabled =
        !auctionState ||
        isDonutEthWriting ||
        isDonutEthConfirming ||
        donutEthBlazeResult !== null ||
        hasInsufficientLP;

    return (
        <Card className="mt-1 flex flex-col p-6">
            <div className="mt-1 grid grid-cols-2 gap-2 h-fit">
                <Card className="border-[#82AF96] bg-[#FFFFF0]">
                    <CardContent className="grid gap-1.5 p-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-800">
                            PAY
                        </div>
                        <div className="text-2xl font-semibold text-[#82AF96]">
                            {auctionPriceDisplay} LP
                        </div>
                        <div className="text-xs text-gray-600">
                            $
                            {auctionState
                                ? (
                                    Number(formatEther(auctionState.price)) *
                                    Number(formatEther(auctionState.paymentTokenPrice)) *
                                    ethUsdPrice
                                ).toFixed(2)
                                : "0.00"}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#82AF96] bg-[#FFFFF0] text-[#82AD94]">
                    <CardContent className="grid gap-1.5 p-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-800">
                            GET
                        </div>
                        <div className="text-2xl font-semibold">
                            Ξ{claimableDisplay}
                        </div>
                        <div className="text-xs text-gray-600">
                            $
                            {auctionState
                                ? (
                                    Number(formatEther(auctionState.wethAccumulated)) *
                                    ethUsdPrice
                                ).toFixed(2)
                                : "0.00"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <Button
                    className="w-full rounded-2xl bg-[#82AF96] py-3 text-base font-bold text-black shadow-lg transition-colors hover:bg-[#82AF96]/90 disabled:cursor-not-allowed disabled:bg-[#82AF96]/80"
                    onClick={handleBlaze}
                    disabled={isBlazeDisabled}
                >
                    {donutEthButtonLabel} DONUT-ETH LP
                </Button>

                <div className="flex items-center justify-between px-1">
                    <div className="text-xs text-black">
                        Available:{" "}
                        <span className="text-black font-semibold">
                            {address && auctionState?.paymentTokenBalance
                                ? formatEth(auctionState.paymentTokenBalance, 4)
                                : "0"}
                        </span>{" "}
                        DONUT-ETH LP
                    </div>
                    <a
                        href="https://app.uniswap.org/explore/pools/base/0xD1DbB2E56533C55C3A637D13C53aeEf65c5D5703"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#82AF96] hover:text-[#82AF96]/80 font-semibold transition-colors"
                    >
                        Get LP →
                    </a>
                </div>

                {/* Profit/Loss Warning Message */}
                {blazeProfitLoss && (
                    <div
                        className={cn(
                            "text-center text-sm font-semibold px-2 py-1.5 rounded",
                            blazeProfitLoss.isProfitable
                                ? "text-green-400"
                                : "text-red-400"
                        )}
                    >
                        {blazeProfitLoss.isProfitable ? (
                            <>
                                💰 Profitable blaze! You&apos;ll receive $
                                {blazeProfitLoss.wethValueInUsd.toFixed(2)} in WETH for $
                                {blazeProfitLoss.lpValueInUsd.toFixed(2)} in LP (
                                {blazeProfitLoss.profitLoss >= 0 ? "+" : ""}$
                                {blazeProfitLoss.profitLoss.toFixed(2)})
                            </>
                        ) : (
                            <>
                                ⚠️ Unprofitable blaze! You&apos;ll receive $
                                {blazeProfitLoss.wethValueInUsd.toFixed(2)} in WETH for $
                                {blazeProfitLoss.lpValueInUsd.toFixed(2)} in LP ($
                                {blazeProfitLoss.profitLoss.toFixed(2)})
                            </>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default DonutEthBlazery;