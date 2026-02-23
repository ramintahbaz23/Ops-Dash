'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface MakePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  nextPaymentAmount: number
  utilityTotalBalance: number
  currentPaymentMethod?: string
  onConfirm: (amount: number, paymentType: 'plan' | 'utility' | 'both', paymentMethod: string) => void
}

export function MakePaymentModal({ 
  isOpen, 
  onClose, 
  nextPaymentAmount,
  utilityTotalBalance,
  currentPaymentMethod,
  onConfirm 
}: MakePaymentModalProps) {
  const [paymentType, setPaymentType] = useState<'plan' | 'utility' | 'both'>('plan')
  const [amount, setAmount] = useState<string>(nextPaymentAmount.toFixed(2))
  const [useDefaultMethod, setUseDefaultMethod] = useState(true)
  const [customPaymentMethod, setCustomPaymentMethod] = useState<'bank' | 'card'>('bank')
  const [bankName, setBankName] = useState('')
  const [accountLast4, setAccountLast4] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) setValidationError(null)
  }, [isOpen])

  const handleClose = () => {
    setValidationError(null)
    onClose()
  }

  const handleConfirm = () => {
    setValidationError(null)
    const numAmount = parseFloat(amount)
    if (numAmount > 0) {
      let paymentMethod = currentPaymentMethod || 'Default payment method'

      if (!useDefaultMethod) {
        if (customPaymentMethod === 'bank') {
          if (!bankName?.trim()) {
            setValidationError('Bank name is required to continue.')
            return
          }
          if (accountLast4.length !== 4) {
            setValidationError('Please enter the last 4 digits of the account.')
            return
          }
          paymentMethod = `${bankName} ••••${accountLast4}`
        } else if (customPaymentMethod === 'card') {
          if (accountLast4.length !== 4) {
            setValidationError('Please enter the last 4 digits of the card.')
            return
          }
          paymentMethod = `Card ••••${accountLast4}`
        } else {
          return
        }
      }

      onConfirm(numAmount, paymentType, paymentMethod)
      handleClose()
    }
  }

  const maxAmount = paymentType === 'both' 
    ? (nextPaymentAmount + utilityTotalBalance)
    : paymentType === 'plan' 
      ? nextPaymentAmount 
      : utilityTotalBalance

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
                <h2 className="text-lg font-semibold">Make Payment</h2>
                <button
                  onClick={handleClose}
                  className="min-h-[44px] min-w-[44px] p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-medium mb-2">Apply payment to</label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentType('plan')
                          setAmount(nextPaymentAmount.toFixed(2))
                        }}
                        className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-md border transition-colors ${
                          paymentType === 'plan'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        Payment Plan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentType('utility')
                          setAmount(utilityTotalBalance.toFixed(2))
                        }}
                        className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-md border transition-colors ${
                          paymentType === 'utility'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        Utility Bill
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentType('both')
                          setAmount((nextPaymentAmount + utilityTotalBalance).toFixed(2))
                        }}
                        className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-md border transition-colors ${
                          paymentType === 'both'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        Both (All)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value
                          const numValue = parseFloat(value)
                          if (value === '' || (numValue >= 0 && numValue <= maxAmount)) {
                            setAmount(value)
                          }
                        }}
                        min="0"
                        max={maxAmount}
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Maximum: ${maxAmount.toFixed(2)}
                      {paymentType === 'both' && (
                        <span className="block mt-1">
                          (${nextPaymentAmount.toFixed(2)} plan + ${utilityTotalBalance.toFixed(2)} utility)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <label className="block text-base font-medium mb-2">Payment Method</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={useDefaultMethod}
                          onChange={() => setUseDefaultMethod(true)}
                          className="w-4 h-4"
                        />
                        <span className="text-base">Use default payment method</span>
                        {currentPaymentMethod && (
                          <span className="text-sm text-muted-foreground">({currentPaymentMethod})</span>
                        )}
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!useDefaultMethod}
                          onChange={() => {
                            setUseDefaultMethod(false)
                            setValidationError(null)
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-base">Use a different payment method</span>
                      </label>
                    </div>

                    {!useDefaultMethod && (
                      <div className="mt-4 space-y-4 pl-6">
                        <div>
                          <label className="block text-base font-medium mb-2">Payment Method Type</label>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setCustomPaymentMethod('bank')}
                              className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-md border transition-colors ${
                                customPaymentMethod === 'bank'
                                  ? 'bg-accent text-accent-foreground border-accent'
                                  : 'bg-background border-border hover:bg-muted'
                              }`}
                            >
                              Bank Account
                            </button>
                            <button
                              type="button"
                              onClick={() => setCustomPaymentMethod('card')}
                              className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-md border transition-colors ${
                                customPaymentMethod === 'card'
                                  ? 'bg-accent text-accent-foreground border-accent'
                                  : 'bg-background border-border hover:bg-muted'
                              }`}
                            >
                              Credit/Debit Card
                            </button>
                          </div>
                        </div>

                        {customPaymentMethod === 'bank' && (
                          <div>
                            <label className="block text-base font-medium mb-2">Bank Name</label>
                            <input
                              type="text"
                        value={bankName}
                        onChange={(e) => {
                          setBankName(e.target.value)
                          setValidationError(null)
                        }}
                              placeholder="e.g., Chase Bank"
                              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-base font-medium mb-2">
                            {customPaymentMethod === 'bank' ? 'Account' : 'Card'} Last 4 Digits
                          </label>
                          <input
                            type="text"
                            value={accountLast4}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                              setAccountLast4(value)
                              setValidationError(null)
                            }}
                            placeholder="1234"
                            maxLength={4}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Validation error banner */}
              {validationError && (
                <div className="mx-6 mt-2 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
                  {validationError}
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end shrink-0 gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="min-h-[44px] min-w-[44px] px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={
                    !amount || 
                    parseFloat(amount) <= 0 ||
                    (!useDefaultMethod && (!accountLast4 || accountLast4.length !== 4 || (customPaymentMethod === 'bank' && !bankName)))
                  }
                  className="min-h-[44px] min-w-[44px] px-4 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Process Payment
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

