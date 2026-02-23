'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { InfoDialog } from './info-dialog'
import { Info } from 'lucide-react'

interface BalanceCardProps {
  utilityTotalBalance: number
  paymentPlanBalance: number
  className?: string
  rounded?: 'left' | 'right' | 'none' | 'both'
}

export function BalanceCard({
  utilityTotalBalance,
  paymentPlanBalance,
  className,
  rounded = 'both'
}: BalanceCardProps) {
  const roundedClasses = {
    left: 'rounded-l-lg rounded-r-none',
    right: 'rounded-r-lg rounded-l-none',
    both: 'rounded-lg',
    none: 'rounded-none',
  }

  const cardId = 'balance-card-label'
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-labelledby={cardId}
      className={cn(
        "bg-card border border-border p-4",
        roundedClasses[rounded],
        className
      )}
    >
      <p
        id={cardId}
        className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1 leading-snug"
      >
        Payment plan balance
      </p>

      <p className="text-3xl font-semibold tracking-tight leading-snug">${paymentPlanBalance.toFixed(2)}</p>
      <div className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2 leading-relaxed">
        <InfoDialog
          title="LADWP"
          content={`Total due to LADWP: $724.15\nPast due to LADWP: $241.39\nNew charges, not past due: $482.76`}
        >
          <span
            className="flex items-center gap-2 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] -m-2 p-2 rounded cursor-default"
            aria-label={`LADWP total balance: $${utilityTotalBalance.toFixed(2)}. Click or hover for breakdown.`}
          >
            <span>LADWP total balance: ${utilityTotalBalance.toFixed(2)}</span>
            <Info size={18} className="text-muted-foreground shrink-0" aria-hidden />
          </span>
        </InfoDialog>
      </div>
    </motion.section>
  )
}
