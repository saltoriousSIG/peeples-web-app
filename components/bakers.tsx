"use client"
import { usePool } from "@/providers/PoolProvider"
import makeBlockie from 'ethereum-blockies-base64';

export function Bakers() {
  const {holders: poolMembers} = usePool()
  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm flex-1 flex flex-col max-h-[600px]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-muted-foreground">Meet the Family</h2>
        <span className="text-xs text-muted-foreground/60 font-medium">{poolMembers?.length} Members</span>
      </div>

      <div className="grid grid-cols-2  gap-3 flex-1 min-h-0 overflow-y-auto pr-2 hide-scrollbar">
        {poolMembers?.map((member, index) => (
          <div
            key={member.address}
            className="group relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 transition-all duration-300 hover:bg-background hover:border-primary/30 hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-border/50 group-hover:ring-primary/50 transition-all shadow-md group-hover:shadow-xl">
                <img
                  src={makeBlockie(member.address)}
                  alt={`Member ${member.address.slice(0, 6)}`}
                  className="w-full h-full object-cover"
                />
                {/* Active indicator */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background shadow-sm" />
              </div>

              {/* Position badge */}
              <span className="text-[10px] font-bold text-muted-foreground/50 bg-muted/50 px-2 py-0.5 rounded-full">
                #{index + 1}
              </span>

              {/* Address */}
              <p className="text-xs font-mono text-foreground/90 tracking-tight text-center">
                {member.address.slice(0, 6)}...{member.address.slice(-4)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
