"use client"

import { useState } from "react"

export function GlazeAction() {
  const [message, setMessage] = useState("")

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm h-full flex flex-col">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a message (optional)"
        className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
      />

      <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg">
        GLAZE
      </button>
    </div>
  )
}
