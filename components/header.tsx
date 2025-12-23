
"use client"
import { BarChart3, Info, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const socialLinks = [
    { href: "https://glazed.world", icon: <Info className="w-4 h-4" />, label: "Info" },
    { href: "https://dune.com/xyk/donut-company", icon: <BarChart3 className="w-4 h-4" />, label: "Analytics" },
    { href: "https://dexscreener.com/base/0x2d3d5f71cf15bd2ae12a5ba87a8a1980efb6eef88f0f5e11cfddf52f02a761c8", icon: <img src="/media/dexscreener.png" className="w-5 h-5 rounded" alt="DexScreener" />, label: "DexScreener" },
    { href: "https://x.com/peeplesdonuts", icon: <img src="/media/x.jpg" className="w-5 h-5 rounded" alt="X" />, label: "X" },
    { href: "https://farcaster.xyz/mrpeeples", icon: <img src="/media/farcaster.png" className="w-5 h-5 rounded" alt="Farcaster" />, label: "Farcaster" },
  ]

  const navTabs = [
    { path: "/", label: "Glaze" },
    { path: "/auction", label: "Auction" },
    { path: "/vote", label: "Vote" },
  ]

  return (
    <header className="relative border-b border-border/50 bg-card/80 shrink-0">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2">
        {/* Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img src="/media/peeples_donuts.png" className="h-[40px] sm:h-[50px] scale-[1.3] sm:scale-[1.5] w-auto" alt="Peeples Donuts" />
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-wide leading-tight">
              <span className="text-primary">PEEPLES</span> <span className="text-foreground">DONUTS</span>
            </h1>
            <p className="hidden sm:block text-[10px] text-muted-foreground italic">Family Owned, Family Operated</p>
          </div>
        </div>

        {/* Navigation Tabs - Always visible */}
        <div className="flex items-center bg-white/60 rounded-full p-0.5 shadow-sm border border-border/30">
          {navTabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all ${
                pathname === tab.path
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop - Social Links & Connect */}
        <div className="hidden md:flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/50"
            >
              {link.icon}
            </a>
          ))}
          <ConnectButton />
        </div>

        {/* Mobile - Connect Button & Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <div className="[&>div]:!p-0">
            <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-lg z-50">
          <div className="flex items-center justify-center gap-4 py-3 px-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/50"
              >
                {link.icon}
                <span className="text-[10px]">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
