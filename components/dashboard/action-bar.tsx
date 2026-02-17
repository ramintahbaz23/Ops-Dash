'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ActionBarProps {
  className?: string
  eligibleForExtension?: boolean
}

export function ActionBar({ className, eligibleForExtension = false }: ActionBarProps) {
  const [showManagePlan, setShowManagePlan] = useState(false)
  const managePlanRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (managePlanRef.current && !managePlanRef.current.contains(event.target as Node)) {
        setShowManagePlan(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const managePlanActions: Array<{ label: string; disabled?: boolean }> = [
    { label: 'Make payment' },
    { label: 'Update method' },
    { label: 'Reschedule' },
    { label: 'Roll-in balance' },
    ...(eligibleForExtension 
      ? [{ label: 'One time extension' }]
      : [{ label: 'Not eligible for extension', disabled: true }]
    ),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn(
        "border-t border-b border-border py-3 px-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Manage Plan Dropdown */}
        <div className="relative" ref={managePlanRef}>
          <button
            onClick={() => setShowManagePlan(!showManagePlan)}
            className="px-4 py-2 text-base font-medium bg-background border border-border text-foreground hover:bg-muted rounded-md transition-colors whitespace-nowrap"
          >
            Manage plan
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showManagePlan && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50"
              >
                <div className="py-1">
                  {managePlanActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!action.disabled) {
                          // Handle action
                          setShowManagePlan(false)
                        }
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-base text-left transition-colors",
                        action.disabled
                          ? "text-muted-foreground cursor-default opacity-60"
                          : "hover:bg-muted"
                      )}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
