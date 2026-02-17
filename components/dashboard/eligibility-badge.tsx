'use client'

import { motion } from 'framer-motion'
import { InfoDialog } from './info-dialog'
import { cn } from '@/lib/utils'

interface EligibilityBadgeProps {
  eligibleForExtension?: boolean
  eligibleForRollIn?: boolean
  className?: string
}

export function EligibilityBadge({ 
  eligibleForExtension, 
  eligibleForRollIn,
  className 
}: EligibilityBadgeProps) {
  const getEligibilityText = () => {
    if (!eligibleForExtension && !eligibleForRollIn) {
      return 'Not Eligible for Extension'
    }
    if (!eligibleForExtension && eligibleForRollIn) {
      return 'Not Eligible for Extension'
    }
    if (eligibleForExtension && !eligibleForRollIn) {
      return 'Not Eligible for Roll-In Balance'
    }
    return 'Not Eligible for Extension & Roll-In'
  }

  const getEligibilityInfo = () => {
    if (!eligibleForExtension && !eligibleForRollIn) {
      return 'This customer is not currently eligible for payment plan extensions. Eligibility is determined based on payment history, account standing, and other factors.'
    }
    if (!eligibleForExtension && eligibleForRollIn) {
      return 'This customer is not currently eligible for payment plan extensions. However, they may be eligible for roll-in balances. Eligibility is determined based on payment history, account standing, and other factors.'
    }
    if (eligibleForExtension && !eligibleForRollIn) {
      return 'This customer is not currently eligible for roll-in balances. However, they may be eligible for extensions. Eligibility is determined based on payment history, account standing, and other factors.'
    }
    return 'This customer is not currently eligible for payment plan extensions or roll-in balances. Eligibility is determined based on payment history, account standing, and other factors.'
  }

  return (
    <InfoDialog
      title="Eligibility Status"
      content={getEligibilityInfo()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium select-none",
          "bg-muted border border-border text-foreground",
          className
        )}
      >
        {getEligibilityText()}
      </motion.div>
    </InfoDialog>
  )
}

