import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative backdrop-blur-xl bg-white/[0.08] border border-white/20 rounded-xl shadow-2xl overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent before:rounded-xl",
          "after:absolute after:inset-0 after:backdrop-blur-3xl after:bg-white/[0.02] after:rounded-xl",
          className
        )}
        {...props}
      >
        <div className="relative z-10 h-full">
          {props.children}
        </div>
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }