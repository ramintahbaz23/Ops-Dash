'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface LinkedAccount {
  id: string
  name: string
  address?: string
  accountNumber: string
}

interface LinkedAccountsModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  linkedAccounts: LinkedAccount[]
  onAccountClick?: (accountId: string) => void
}

export function LinkedAccountsModal({ 
  isOpen, 
  onClose, 
  phoneNumber,
  linkedAccounts,
  onAccountClick
}: LinkedAccountsModalProps) {
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
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-semibold">Accounts linked to this phone number <span className="font-normal">({phoneNumber})</span></h2>
                </div>
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
                {linkedAccounts.length > 0 ? (
                  <div className="space-y-2">
                    {linkedAccounts.map((account) => (
                      <motion.button
                        key={account.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          onAccountClick?.(account.id)
                          onClose()
                        }}
                        className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-base font-medium">{account.name}</p>
                            {account.address && (
                              <p className="text-base text-muted-foreground mt-1">{account.address}</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">Account: {account.accountNumber}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-muted-foreground text-center py-8">
                    No other accounts found for this phone number.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

