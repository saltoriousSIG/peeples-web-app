import React, { useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { formatUnits, formatEther, zeroAddress } from "viem";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { TxStep } from "@/types/blazery.type";
import { useEthPrice } from "@/providers/PricesProvider";
import { CONTRACT_ADDRESSES, MULTICALL_ABI, PEEPLES_BLAZERY, ERC20 } from "@/lib/contracts";
import { useReadContracts, useAccount, useWriteContract, useWaitForTransactionReceipt, useConnect } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import axios from "axios";
import type { Address } from "viem";


const PEEPLES_DONUT_LP_TOKEN_ADDRESS =
    "0x189f254685CD46E48CbdCe39E9572695dDe92402" as Address;

const DEADLINE_BUFFER_SECONDS = 5 * 60;

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

const DonutPeeplesBlazery: React.FC = () => {

    const [peeplesDonutBlazeResult, setPeeplesDonutBlazeResult] = useState<"success" | "failure" | null>(null);
    const [peeplesDonutTxStep, setPeeplesDonutTxStep] = useState<TxStep>("idle");
    const peeplesDonutResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { ethPrice: ethUsdPrice = 0 } = useEthPrice();
    const { address } = useAccount();
    const { connectors, connectAsync, isPending: isConnecting } = useConnect();
    const primaryConnector = connectors[0];

    const { data: peeplesTokenPrice } = useQuery({
        queryKey: ['peeplesTokenPrice'],
        queryFn: async () => {
            const { data } = await axios.get('/api/clanker/token_info');
            console.log(data.peeples_price);
            return data.peeples_price;
        },
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: peeplesDonutTxHash,
        writeContract: writePeeplesDonutContract,
        isPending: isPeeplesDonutWriting,
        isError: isPeeplesDonutError,
        reset: resetPeeplesDonutWrite,
    } = useWriteContract();

    const { data: peeplesDonutReceipt, isLoading: isPeeplesDonutConfirming } =
        useWaitForTransactionReceipt({
            hash: peeplesDonutTxHash,
            chainId: base.id,
        });




    const { data } = useReadContracts({
        contracts: [
            {
                address: CONTRACT_ADDRESSES.multicall,
                abi: MULTICALL_ABI,
                functionName: "getMiner",
                args: [address ?? zeroAddress],
                chainId: base.id,
            },
            {
                address: CONTRACT_ADDRESSES.peeples_blazery,
                abi: PEEPLES_BLAZERY,
                functionName: "getSlot0",
                args: [],
                chainId: base.id,
            },
            {
                address: CONTRACT_ADDRESSES.peeples_blazery,
                abi: PEEPLES_BLAZERY,
                functionName: "paymentToken",
                args: [],
                chainId: base.id,
            },
            {
                address: CONTRACT_ADDRESSES.peeples_blazery,
                abi: PEEPLES_BLAZERY,
                functionName: "getPrice",
                args: [],
                chainId: base.id,
            },
            {
                address: CONTRACT_ADDRESSES.donut,
                abi: ERC20,
                functionName: "balanceOf",
                args: [PEEPLES_DONUT_LP_TOKEN_ADDRESS],
                chainId: base.id
            },
            {
                address: PEEPLES_DONUT_LP_TOKEN_ADDRESS,
                abi: ERC20,
                functionName: "totalSupply",
                args: [],
                chainId: base.id
            },
            {
                address: CONTRACT_ADDRESSES.donut,
                abi: ERC20,
                functionName: "balanceOf",
                args: [CONTRACT_ADDRESSES.peeples_blazery],
                chainId: base.id
            },
            {
                address: CONTRACT_ADDRESSES.weth,
                abi: ERC20,
                functionName: "balanceOf",
                args: [CONTRACT_ADDRESSES.peeples_blazery],
                chainId: base.id
            },
            {
                address: CONTRACT_ADDRESSES.peeples,
                abi: ERC20,
                functionName: "balanceOf",
                args: [CONTRACT_ADDRESSES.peeples_blazery],
                chainId: base.id
            },
            {
                address: PEEPLES_DONUT_LP_TOKEN_ADDRESS,
                abi: ERC20,
                functionName: "balanceOf",
                args: [address!],
                chainId: base.id
            }
        ],
    });

    const [minerData, slot0Data, paymentTokenAddress, priceData, donutLPBalance, LPTotalSupply, donutBlazeryBalance, wethBlazeryBalance, peeplesBlazeryBalance, userLPBalance] = data ?? [];

    const peeplesBlazeryState = useMemo(() => {
        if (!minerData || !slot0Data || !paymentTokenAddress || !priceData || !donutLPBalance || !LPTotalSupply || !donutBlazeryBalance || !wethBlazeryBalance || !peeplesBlazeryBalance || !userLPBalance) {
            return null;
        }
        const donutPriceEth = minerData.result?.donutPrice;
        const paymentTokenPrice = donutPriceEth && donutLPBalance.result && LPTotalSupply.result ? donutPriceEth * donutLPBalance.result * 2n / LPTotalSupply.result : 0n
        const totalBlazeValue = (parseFloat(formatUnits(donutBlazeryBalance.result || 0n, 18)) * (donutPriceEth ? parseFloat(formatUnits(donutPriceEth, 18)) : 0) * ethUsdPrice) + (parseFloat(formatUnits(wethBlazeryBalance.result || 0n, 18)) * ethUsdPrice) + parseFloat(formatUnits(peeplesBlazeryBalance.result || 0n, 18)) * (peeplesTokenPrice || 0);
        return {
            initPrice: slot0Data.result?.initPrice,
            epochId: slot0Data.result?.epochId,
            startTime: slot0Data.result?.startTime,
            paymentToken: paymentTokenAddress.result,
            price: priceData.result,
            paymentTokenPrice,
            donutBlazeryBalance: donutBlazeryBalance.result,
            wethBlazeryBalance: wethBlazeryBalance.result,
            peeplesBlazeryBalance: peeplesBlazeryBalance.result,
            totalBlazeValue,
            userLPBalance: userLPBalance.result,
            pnl: totalBlazeValue - (parseFloat(formatUnits(priceData.result || 0n, 18)) * (paymentTokenPrice ? parseFloat(formatUnits(paymentTokenPrice, 18)) : 0) * ethUsdPrice)
        }
    }, [minerData, slot0Data, paymentTokenAddress, priceData, donutLPBalance, LPTotalSupply, donutBlazeryBalance, wethBlazeryBalance, peeplesBlazeryBalance, ethUsdPrice, peeplesTokenPrice, userLPBalance]);

    const peeplesDonutButtonLabel = useMemo(() => {
        if (!peeplesBlazeryState) return "Loading…";
        if (peeplesDonutBlazeResult === "success") return "SUCCESS";
        if (peeplesDonutBlazeResult === "failure") return "FAILURE";
        if (isPeeplesDonutWriting || isPeeplesDonutConfirming) {
            if (peeplesDonutTxStep === "approving") return "APPROVING…";
            if (peeplesDonutTxStep === "buying") return "BLAZING…";
            return "PROCESSING…";
        }
        return "BLAZE";
    }, [peeplesDonutBlazeResult, isPeeplesDonutConfirming, isPeeplesDonutWriting, peeplesBlazeryState, peeplesDonutTxStep]);

    const resetPeeplesDonutBlazeResult = useCallback(() => {
        if (peeplesDonutResultTimeoutRef.current) {
            clearTimeout(peeplesDonutResultTimeoutRef.current);
            peeplesDonutResultTimeoutRef.current = null;
        }
        setPeeplesDonutBlazeResult(null);
    }, []);

    const showPeeplesDonutBlazeResult = useCallback((result: "success" | "failure") => {
        if (peeplesDonutResultTimeoutRef.current) {
            clearTimeout(peeplesDonutResultTimeoutRef.current);
        }
        setPeeplesDonutBlazeResult(result);
        peeplesDonutResultTimeoutRef.current = setTimeout(() => {
            setPeeplesDonutBlazeResult(null);
            peeplesDonutResultTimeoutRef.current = null;
        }, 3000);
    }, []);


    const handlePeeplesBlaze = useCallback(async () => {
        if (!peeplesBlazeryState) return;
        resetPeeplesDonutBlazeResult();
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

            const price = peeplesBlazeryState.price;
            const epochId = toBigInt(peeplesBlazeryState.epochId as number);
            const deadline = BigInt(
                Math.floor(Date.now() / 1000) + DEADLINE_BUFFER_SECONDS
            );
            const maxPaymentTokenAmount = price;

            if (peeplesDonutTxStep === "idle") {
                setPeeplesDonutTxStep("approving");
                writePeeplesDonutContract({
                    account: targetAddress as Address,
                    address: PEEPLES_DONUT_LP_TOKEN_ADDRESS,
                    abi: ERC20,
                    functionName: "approve",
                    args: [CONTRACT_ADDRESSES.peeples_blazery as Address, price as bigint],
                    chainId: base.id,
                });
                return;
            }
            if (peeplesDonutTxStep === "buying") {
                writePeeplesDonutContract({
                    account: targetAddress as Address,
                    address: CONTRACT_ADDRESSES.peeples_blazery as Address,
                    abi: PEEPLES_BLAZERY,
                    functionName: "buy",
                    args: [[CONTRACT_ADDRESSES.donut, CONTRACT_ADDRESSES.weth, CONTRACT_ADDRESSES.peeples], targetAddress as Address, epochId as bigint, deadline as bigint, maxPaymentTokenAmount as bigint],
                    chainId: base.id,
                });
            }
        } catch (e: unknown) {
            console.error("Failed to peeples blaze:", e);
            showPeeplesDonutBlazeResult("failure");
            setPeeplesDonutTxStep("idle");
            resetPeeplesDonutWrite();
        }
    }, [
        address,
        connectAsync,
        peeplesBlazeryState,
        primaryConnector,
        peeplesDonutTxStep,
        resetPeeplesDonutBlazeResult,
        resetPeeplesDonutWrite,
        showPeeplesDonutBlazeResult,
        writePeeplesDonutContract,
    ]);



    const hasInsufficientPeeplesLP =
        (peeplesBlazeryState?.userLPBalance && peeplesBlazeryState?.price) ? peeplesBlazeryState?.userLPBalance < peeplesBlazeryState?.price : true;

    const isPeeplesBlazeDisabled =
        !peeplesBlazeryState ||
        isPeeplesDonutWriting ||
        isPeeplesDonutConfirming ||
        peeplesDonutBlazeResult !== null ||
        hasInsufficientPeeplesLP;

    return (
        <Card className="mt-2 p-6">
            <h2 className="uppercase font-bold">Donut-PEEPLES Blazery:</h2>
            <div className="mt-1 grid grid-cols-2 gap-2 h-fit">
                <Card className="border-[#82AF96] bg-[#FFFFF0]">
                    <CardContent className="grid gap-1.5 p-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-800">
                            PAY
                        </div>
                        <div className="text-2xl font-semibold text-[#82AF96]">
                            {parseFloat(
                                formatUnits(peeplesBlazeryState?.price || 0n, 18)
                            ).toFixed(4)}{" "}
                            LP
                        </div>
                        <div className="text-xs text-gray-600">
                            $
                            {peeplesBlazeryState
                                ? (
                                    Number(formatEther(peeplesBlazeryState?.price || 0n)) *
                                    Number(formatEther(peeplesBlazeryState?.paymentTokenPrice || 0n)) *
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
                        <div className="text-base font-semibold flex flex-col">
                            <span>{formatUnits(peeplesBlazeryState?.wethBlazeryBalance || 0n, 18)} $WETH</span>
                            <span>{formatUnits(peeplesBlazeryState?.donutBlazeryBalance || 0n, 18)} $DONUT</span>
                            <span>{formatUnits(peeplesBlazeryState?.peeplesBlazeryBalance || 0n, 18)} $PEEPLES</span>
                        </div>
                        <div className="text-xs text-gray-600">
                            $
                            {peeplesBlazeryState
                                ? (
                                    peeplesBlazeryState.totalBlazeValue || 0
                                ).toFixed(2)
                                : "0.00"}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-4 flex flex-col gap-2">
                <Button
                    className="w-full rounded-2xl bg-[#82AF96] py-3 text-base font-bold text-black shadow-lg transition-colors hover:bg-[#82AF96]/90 disabled:cursor-not-allowed disabled:bg-[#82AF96]/80"
                    onClick={handlePeeplesBlaze}
                    disabled={isPeeplesBlazeDisabled as boolean}
                >
                    {peeplesDonutButtonLabel} DONUT-PEEPLES LP
                </Button>

                <div className="flex items-center justify-between px-1">
                    <div className="text-xs text-black">
                        Available:{" "}
                        <span className="text-black font-semibold">
                            {address && peeplesBlazeryState?.userLPBalance
                                ? formatEth(peeplesBlazeryState.userLPBalance, 4)
                                : "0"}
                        </span>{" "}
                        DONUT-PEEPLES LP
                    </div>
                    <a
                        href="https://app.uniswap.org/explore/pools/base/0x189f254685CD46E48CbdCe39E9572695dDe92402"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#82AF96] hover:text-[#82AF96]/80 font-semibold transition-colors"
                    >
                        Get LP →
                    </a>
                </div>

                {/* Profit/Loss Warning Message */}
                {peeplesBlazeryState?.pnl && (
                    <div
                        className={cn(
                            "text-center text-sm font-semibold px-2 py-1.5 rounded",
                            peeplesBlazeryState?.pnl > 0
                                ? "text-green-400"
                                : "text-red-400"
                        )}
                    >
                        {peeplesBlazeryState.pnl > 0 ? (
                            <>
                                💰 Profitable blaze! You&apos;ll receive $
                                {peeplesBlazeryState.totalBlazeValue.toFixed(2)} in Tokens for $
                                {(Number(formatEther(peeplesBlazeryState?.price || 0n)) *
                                    Number(formatEther(peeplesBlazeryState?.paymentTokenPrice || 0n)) *
                                    ethUsdPrice).toFixed(2)} in LP
                            </>
                        ) : (
                            <>
                                ⚠️ Unprofitable blaze! You&apos;ll receive $
                                {peeplesBlazeryState.totalBlazeValue.toFixed(2)} in Tokens for $
                                {(Number(formatEther(peeplesBlazeryState?.price || 0n)) *
                                    Number(formatEther(peeplesBlazeryState?.paymentTokenPrice || 0n)) *
                                    ethUsdPrice).toFixed(2)} in LP

                            </>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}

export default DonutPeeplesBlazery;