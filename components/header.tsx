"use client"
import { BarChart3, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"


export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/80 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src='/media/peeples_donuts.png' className="h-[50px] scale-[1.5] w-auto" /> <div>
          <h1 className="text-base font-bold tracking-wide leading-tight">
            <span className="text-primary">PEEPLES</span> <span className="text-foreground">DONUTS</span>
          </h1>
          <p className="text-[10px] text-muted-foreground italic">Family Owned, Family Operated</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center bg-white/60 rounded-full p-0.5 shadow-sm border border-border/30">
        <button
          onClick={() => router.push("/")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${pathname === "/"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Glaze
        </button>

        <button
          onClick={() => router.push("/auction")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${pathname === "/auction"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Auction
        </button>
        <button
          onClick={() => router.push("/vote")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${pathname === "/vote"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Vote
        </button>
      </div>

      {/* Right - User Profile */}
      <div className="flex items-center gap-3 flex-row xs:flex-col">
        <a href="https://glazed.world" target="_blank" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/50">
          <Info className="w-4 h-4" />
        </a>
        <a href="https://dune.com/xyk/donut-company" target="_blank" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/50">
          <BarChart3 className="w-4 h-4" />
        </a>
        <a href="https://dexscreener.com/base/0x2d3d5f71cf15bd2ae12a5ba87a8a1980efb6eef88f0f5e11cfddf52f02a761c8" target="_blank" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/50">
          <img src="/media/dexscreener.png" className="w-5 h-5 rounded" />
        </a>
        <a href="https://x.com/peeplesdonuts" target="_blank" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/50">
          <img src="/media/x.jpg" className="w-5 h-5 rounded" />
        </a>
        <a href="https://farcaster.xyz/mrpeeples" target="_blank" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/50">
          <img src="/media/farcaster.png" className="w-5 h-5 rounded" />
        </a>
        <ConnectButton />
      </div>
    </header>
  )
}
