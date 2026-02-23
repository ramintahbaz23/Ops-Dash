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
  const cardId = `metric-card-${title.replace(/\s+/g, '-').toLowerCase()}`

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
        {title}
      </p>
      <p className="text-3xl font-semibold tracking-tight leading-snug">{value}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
      )}
      {showProgress && (
        <div
          className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden relative"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title}: ${progressCurrent} of ${progressTotal}`}
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </motion.section>
  )
}
