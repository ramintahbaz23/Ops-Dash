'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  className?: string
  rounded?: 'left' | 'right' | 'none' | 'both'
  /** Optional progress bar: current and total (e.g. 2 of 6 months) */
  progressCurrent?: number
  progressTotal?: number
}

export function MetricCard({ 
  title, 
  value, 
  subtitle,
  className,
  rounded = 'both',
  progressCurrent,
  progressTotal,
}: MetricCardProps) {
  const roundedClasses = {
    left: 'rounded-l-lg rounded-r-none',
    right: 'rounded-r-lg rounded-l-none',
    both: 'rounded-lg',
    none: 'rounded-none',
  }

  const showProgress = progressCurrent != null && progressTotal != null && progressTotal > 0
  const progressPercent = showProgress ? Math.min(100, (progressCurrent / progressTotal) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-card border border-border p-4",
        roundedClasses[rounded],
        className
      )}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
        {title}
      </p>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      )}
      {showProgress && (
        <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden relative" aria-hidden>
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </motion.div>
  )
}

