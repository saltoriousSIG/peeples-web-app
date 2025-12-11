
"use client"

import { useState, useEffect } from "react"
import { Crown } from "lucide-react"

export function CurrentOperator() {
  const [time, setTime] = useState({ minutes: 12, seconds: 12 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="teal-gradient-card rounded-2xl p-3 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">KING GLAZER</span>
        </div>
        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">REIGNING</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
          <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
        </div>
        <div>
          <p className="font-bold text-white text-sm sm:text-base">0xa1B7...1004</p>
          <p className="text-xs sm:text-sm text-white/70">@unknown</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-white/70">TIME</p>
          <p className="font-bold text-white text-base sm:text-lg">
            {time.minutes}m {time.seconds.toString().padStart(2, "0")}s
          </p>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-3 sm:p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">GLAZED</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">🍩 1,464</span>
            <span className="text-sm text-white/70">$255.58</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">PNL</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">+Ξ0.30298</span>
            <span className="text-sm text-white/70">+$990.71</span>
          </div>
        </div>
        <div className="h-px bg-white/20" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">TOTAL PNL</span>
          <span className="font-bold text-green-300 text-lg">+$1,246.29</span>
        </div>
      </div>
    </div>
  )
}
