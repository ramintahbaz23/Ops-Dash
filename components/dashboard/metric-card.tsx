'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  className?: string
  rounded?: 'left' | 'right' | 'none' | 'both'
}

export function MetricCard({ 
  title, 
  value, 
  subtitle,
  className,
  rounded = 'both'
}: MetricCardProps) {
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
        {title}
      </p>
      <p className="text-4xl font-semibold mb-1">{value}</p>
      {subtitle && (
        <p className="text-base text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  )
}

