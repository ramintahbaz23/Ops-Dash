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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-card border border-border p-6",
        roundedClasses[rounded],
        className
      )}
    >
      <p className="text-lg font-medium text-muted-foreground mb-2">
        Payment plan balance
      </p>
      
      <p className="text-4xl font-semibold mb-1">${paymentPlanBalance.toFixed(2)}</p>
      <div className="text-base text-muted-foreground flex items-center gap-1.5">
        <InfoDialog
          title="LADWP"
          content={`Total due to LADWP: $724.15\nPast due to LADWP: $241.39\nNew charges, not past due: $482.76`}
        >
          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <span>LADWP total balance: ${utilityTotalBalance.toFixed(2)}</span>
            <Info size={14} className="text-muted-foreground" />
          </span>
        </InfoDialog>
      </div>
    </motion.div>
  )
}

