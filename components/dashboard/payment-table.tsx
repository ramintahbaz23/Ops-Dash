'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Payment } from '@/lib/mock-data'
import { PaymentReceiptModal } from './payment-receipt-modal'
import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'

interface PaymentTableProps {
  nextPaymentDate: string
  nextPaymentAmount: number
  paymentHistory: Payment[]
  autoPay?: boolean
  eligibleForExtension?: boolean
  onPayNow?: () => void
}

export function PaymentTable({ nextPaymentDate, nextPaymentAmount, paymentHistory, autoPay = false, eligibleForExtension = false, onPayNow }: PaymentTableProps) {
  const [showHistory, setShowHistory] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<{ receipt: Payment['receipt'], amount: number, date: string } | null>(null)

  const renderBankName = (bankName: string) => {
    const showBankIcon = bankName === 'Chase Bank' || bankName === 'Bank of America' || bankName === 'Wells Fargo'
    return (
      <span className="flex items-center gap-1.5">
        {showBankIcon && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round">
            <path d="M11.9961 7.01367H12.0051" />
            <path d="M4 10.0088V18.5038M8 10.0088V18.5038" />
            <path d="M16 10.0088V18.5038M20 10.0088V18.5038" />
            <path d="M22 18.5039H2V22.0019H21.9997L22 18.5039Z" />
            <path d="M2.00551 7.01297L11.9844 2.00106C11.9872 1.99965 11.9906 1.99965 11.9934 2.00106L21.9945 7.01297C21.9979 7.01466 22 7.01812 22 7.0219V10.0088H2V7.0219C2 7.01812 2.00213 7.01466 2.00551 7.01297Z" />
          </svg>
        )}
        <span>{bankName}</span>
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-md overflow-hidden"
    >
      {/* Table Header */}
      <div className="bg-muted border-b border-border px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-6 items-center">
        <p className="text-base font-medium text-muted-foreground">Upcoming Due Date</p>
        <p className="text-base font-medium text-muted-foreground pl-16 hidden sm:block">Payment Method</p>
        <p className="text-base font-medium text-muted-foreground text-right">Amount</p>
      </div>

      {/* Upcoming Payment Row - always shown */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-6 items-center bg-white border-b border-border"
      >
        <p className="text-base">{nextPaymentDate}</p>
        <p className="text-base text-muted-foreground pl-16 hidden sm:block">
          {paymentHistory.length > 0 && paymentHistory[0].receipt?.bankName && paymentHistory[0].receipt?.bankAccountLast4
            ? (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  {renderBankName(paymentHistory[0].receipt.bankName)} ••••{paymentHistory[0].receipt.bankAccountLast4}
                  {autoPay && <span className="shrink-0 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Auto-Pay</span>}
                </span>
              )
            : '—'}
        </p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="text-base font-medium">${nextPaymentAmount.toFixed(2)}</span>
        </div>
      </motion.div>

      {/* Payment History - separator and rows when expanded */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="divide-y divide-border"
          >
            <div className="px-6 py-2 bg-muted/50 border-b border-border">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Payment history</p>
            </div>
            {paymentHistory.length === 0 ? (
              <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-muted-foreground/60 mb-3" aria-hidden />
                <p className="text-base font-medium text-foreground mb-1">No payment history yet</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Payments will appear here once the first installment is processed.
                </p>
              </div>
            ) : (
              paymentHistory.map((payment, index) => {
                const isClickable = payment.status === 'paid' && payment.receipt
                const receipt = payment.receipt
                const hasBankInfo = receipt?.bankName && receipt?.bankAccountLast4

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => {
                      if (isClickable) {
                        setSelectedReceipt({ receipt: payment.receipt!, amount: payment.amount, date: payment.date })
                      }
                    }}
                    className={cn(
                      "w-full px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-6 items-center bg-white transition-colors",
                      isClickable
                        ? "hover:bg-muted/50 cursor-pointer"
                        : "cursor-default"
                    )}
                  >
                    <p className="text-base">{payment.date}</p>
                    <p className="text-base text-muted-foreground pl-16 hidden sm:block min-w-0 overflow-hidden text-ellipsis">
                      {hasBankInfo ? (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          {renderBankName(receipt!.bankName ?? '')} ••••{receipt!.bankAccountLast4}
                        </span>
                      ) : (
                        receipt?.paymentMethod || '—'
                      )}
                    </p>
                    <p className="text-base font-medium text-right">
                      ${payment.amount.toFixed(2)}
                    </p>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border text-center">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 text-base text-foreground underline hover:text-accent transition-colors"
        >
          {showHistory ? 'Hide payment history' : 'View payment history'}
        </button>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && selectedReceipt.receipt && (
        <PaymentReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={selectedReceipt.receipt}
          amount={selectedReceipt.amount}
          date={selectedReceipt.date}
        />
      )}
    </motion.div>
  )
}

