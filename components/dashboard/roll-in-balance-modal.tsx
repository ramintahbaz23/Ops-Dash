'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface RollInBalanceModalProps {
  isOpen: boolean
  onClose: () => void
  utilityBalance: number
  currentPlanBalance: number
  onConfirm: (amount: number) => void
}

export function RollInBalanceModal({ 
  isOpen, 
  onClose, 
  utilityBalance,
  currentPlanBalance,
  onConfirm 
}: RollInBalanceModalProps) {
  const [amount, setAmount] = useState<string>(utilityBalance.toFixed(2))

  const handleConfirm = () => {
    const numAmount = parseFloat(amount)
    if (numAmount > 0 && numAmount <= utilityBalance) {
      onConfirm(numAmount)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-lg w-full flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <h2 className="text-lg font-semibold">Roll-in Balance</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-base text-muted-foreground mb-1">Current utility balance:</p>
                    <p className="text-base font-medium">${utilityBalance.toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="text-base text-muted-foreground mb-1">Current payment plan balance:</p>
                    <p className="text-base font-medium">${currentPlanBalance.toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-2">Amount to Roll In</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value
                          const numValue = parseFloat(value)
                          if (value === '' || (numValue >= 0 && numValue <= utilityBalance)) {
                            setAmount(value)
                          }
                        }}
                        min="0"
                        max={utilityBalance}
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Maximum: ${utilityBalance.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-sm text-muted-foreground">
                      Rolling in ${amount || '0.00'} will add this amount to your payment plan balance. 
                      The payment plan will be recalculated to include this additional balance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end shrink-0 gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="px-4 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Roll In Balance
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


