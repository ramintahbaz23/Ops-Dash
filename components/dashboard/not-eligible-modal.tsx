'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface NotEligibleModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotEligibleModal({ isOpen, onClose }: NotEligibleModalProps) {
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
                <h2 className="text-lg font-semibold">Not Eligible for Extension</h2>
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
                    <h3 className="text-base font-medium mb-2">Why this account is not eligible:</h3>
                    <ul className="list-disc list-inside text-base text-muted-foreground space-y-1">
                      <li>Account has already received an extension within the last 12 months</li>
                      <li>Account has a history of late payments</li>
                      <li>Current payment plan is already at maximum length</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-2">Available options:</h3>
                    <ul className="list-disc list-inside text-base text-muted-foreground space-y-1">
                      <li>Make a payment to reduce the balance</li>
                      <li>Update payment method to ensure future payments process successfully</li>
                      <li>Roll in additional balance to extend the payment plan</li>
                      <li>Contact customer service for alternative arrangements</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end shrink-0">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


