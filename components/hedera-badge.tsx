import { TrendingUp } from "lucide-react"

interface HederaBadgeProps {
  transactionId?: string
  verified?: boolean
}

export function HederaBadge({ transactionId, verified = true }: HederaBadgeProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Verified on Hedera</span>
      </div>
      {transactionId && (
        <p className="mt-2 text-xs text-muted-foreground">
          Transaction: <span className="font-mono text-foreground">{transactionId}</span>
        </p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        All transactions are recorded on the Hedera Consensus Service for complete transparency and immutability.
      </p>
    </div>
  )
}
