"use client";
import type React from "react";
import { Strategy, STRATEGY_NAME_MAPPING } from "@/types/pool.type";
import { useState, useMemo, useEffect } from "react";
import { usePool } from "@/providers/PoolProvider";
import { Header } from "@/components/header";
import { Clock, TrendingUp, Shield, Zap, Target } from "lucide-react";
import SundayCountdown from "@/components/sunday-countdown";

const STRATEGY_MINUTES_BREAKEVEN: Record<Strategy, number> = {
  [Strategy.CONSERVATIVE]: 30,
  [Strategy.MODERATE]: 60,
  [Strategy.AGGRESSIVE]: 165,
  [Strategy.DEGEN]: 200,
};

interface VoteOptionData {
  id: Strategy;
  label: string;
  icon: React.ReactNode;
  time: string;
  description: string;
  color: string;
  votes: number;
}

interface VoteOption {
  id: string;
  strategy: string;
  description: string;
  icon: React.ReactNode;
  percentage: number;
}

export default function VotePage() {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Strategy>();

  const { vote, voteEpoch, votes, hasUserVoted, config } = usePool();

  useEffect(() => {
    setHasVoted(hasUserVoted ?? false);
  }, [hasUserVoted]);

  const currentStrategy = useMemo(() => {
    return config ? STRATEGY_NAME_MAPPING[config.strategy as Strategy] : null;
  }, [config]);

  const voteOptions: VoteOptionData[] = useMemo(() => {
    const voteTypes = [
      {
        id: Strategy.CONSERVATIVE,
        label: "Conservative",
        time: `≤${STRATEGY_MINUTES_BREAKEVEN[Strategy.CONSERVATIVE]}min`,
        icon: <Shield className="w-6 h-6" />,
        description: "Lower risk, stable returns",
        color: "#5C946E",
      },
      {
        id: Strategy.MODERATE,
        label: "Moderate",
        time: `≤${STRATEGY_MINUTES_BREAKEVEN[Strategy.MODERATE]}min`,
        icon: <Target className="w-6 h-6" />,
        description: "Balanced risk & reward",
        color: "#F4A259",
      },
      {
        id: Strategy.AGGRESSIVE,
        label: "Aggressive",
        time: `≤${STRATEGY_MINUTES_BREAKEVEN[Strategy.AGGRESSIVE]}min`,
        icon: <TrendingUp className="w-6 h-6" />,
        description: "Higher risk for growth",
        color: "#BC4B51",
      },
      {
        id: Strategy.DEGEN,
        label: "Degen",
        time: `≤${STRATEGY_MINUTES_BREAKEVEN[Strategy.DEGEN]}min`,
        icon: <Zap className="w-6 h-6" />,
        description: "Maximum risk & reward",
        color: "#FF6B6B",
      },
    ];
    const voteBreakdown: Record<Strategy, number> = {
      [Strategy.CONSERVATIVE]: 0,
      [Strategy.MODERATE]: 0,
      [Strategy.AGGRESSIVE]: 0,
      [Strategy.DEGEN]: 0,
    };
    votes?.forEach((vote) => {
      voteBreakdown[vote.strategy]++;
    });
    return voteTypes.map((option) => ({
      ...option,
      votes: voteBreakdown[option.id],
    }));
  }, [votes]);

  const handleCastVote = async() => {
    if (selectedOption !== null) {
      await vote(selectedOption as Strategy);
      setHasVoted(true);
    }
  };

  if (hasVoted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-pink-950/40 rounded-3xl p-8 shadow-2xl border-2 border-amber-200/50 dark:border-amber-800/50 overflow-hidden">
              {/* Decorative donut pattern background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-amber-200/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                      <span className="text-4xl">🍩</span>
                      Strategy Vote
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Vote for next week's baking strategy
                    </p>
                  </div>
                  <div className="bg-primary/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-primary/20">
                    <SundayCountdown />
                  </div>
                </div>

                {/* Current Strategy Badge */}
                <div className="mb-6 inline-block">
                  <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    Current: {currentStrategy}
                  </div>
                </div>

                {/* Vote Recorded Message */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 mb-6 shadow-xl border border-green-400/50">
                  <div className="text-center">
                    <div className="text-5xl mb-2">✓</div>
                    <p className="text-white font-bold text-xl mb-1">
                      Vote Recorded!
                    </p>
                    <p className="text-white/90 text-sm">
                      Thanks for helping the family decide
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Current Results
                  </h3>
                  {voteOptions.map((option) => {
                    const percentage = (
                      (option.votes / votes.length) *
                      100
                    ).toFixed(2);
                    return (
                      <div
                        key={option.id}
                        className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-muted-foreground">
                              {option.icon}
                            </div>
                            <span className="font-semibold text-foreground">
                              {option.label}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-primary">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-pink-950/40 rounded-3xl p-8 shadow-2xl border-2 border-amber-200/50 dark:border-amber-800/50 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-amber-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-4xl">🍩</span>
                    Strategy Vote
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Vote for next week's baking strategy
                  </p>
                </div>
                <div className="bg-primary/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-primary/20">
                  <SundayCountdown />
                </div>
              </div>

              {/* Current Strategy Badge */}
              <div className="mb-8 inline-block">
                <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  Current: {currentStrategy}
                </div>
              </div>

              {/* Vote Options */}
              <div className="space-y-3 mb-6">
                {voteOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full bg-card/60 backdrop-blur-sm rounded-xl p-5 border-2 transition-all hover:scale-[1.02] hover:shadow-lg ${
                      selectedOption === option.id
                        ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`transition-colors ${
                            selectedOption === option.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {option.icon}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-foreground text-lg">
                            {option.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedOption === option.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30 bg-transparent"
                        }`}
                      >
                        {selectedOption === option.id && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCastVote}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all text-lg shadow-lg"
              >
                Cast Your Vote 🗳️
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
