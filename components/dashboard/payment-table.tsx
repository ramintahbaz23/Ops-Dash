'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Payment } from '@/lib/mock-data'
import { PaymentReceiptModal } from './payment-receipt-modal'
import { cn } from '@/lib/utils'

interface PaymentTableProps {
  nextPaymentDate: string
  nextPaymentAmount: number
  paymentHistory: Payment[]
  autoPay?: boolean
  eligibleForExtension?: boolean
}

export function PaymentTable({ nextPaymentDate, nextPaymentAmount, paymentHistory, autoPay = false, eligibleForExtension = false }: PaymentTableProps) {
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
      <div className="bg-muted border-b border-border px-6 py-3 grid grid-cols-3 gap-6 items-center">
        <p className="text-base font-medium text-muted-foreground">
          {showHistory ? 'Payment history' : 'Upcoming payment'}
        </p>
        <p className="text-base font-medium text-muted-foreground pl-16">Payment Method</p>
        <p className="text-base font-medium text-muted-foreground text-right">Amount</p>
      </div>

      {/* Upcoming Payment Row */}
      {!showHistory && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => {
            // Show receipt for upcoming payment using the most recent payment's receipt as template
            if (paymentHistory.length > 0 && paymentHistory[0].receipt) {
              const mostRecentReceipt = paymentHistory[0].receipt
              // Create a receipt for the upcoming payment based on the most recent one
              const upcomingReceipt = {
                ...mostRecentReceipt,
                referenceId: `TXN-${nextPaymentDate.replace(/\s/g, '-').toLowerCase()}-UPCOMING`,
                transactionDate: nextPaymentDate,
                transactionTime: 'Scheduled',
              }
              setSelectedReceipt({ 
                receipt: upcomingReceipt, 
                amount: nextPaymentAmount, 
                date: nextPaymentDate 
              })
            }
          }}
          className="px-6 py-4 grid grid-cols-3 gap-6 items-center bg-white hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <p className="text-base">{nextPaymentDate}</p>
          <p className="text-base text-muted-foreground pl-16 whitespace-nowrap flex items-center gap-1.5">
            {paymentHistory.length > 0 && paymentHistory[0].receipt?.bankName && paymentHistory[0].receipt?.bankAccountLast4
              ? (
                  <>
                    {renderBankName(paymentHistory[0].receipt.bankName)} ••••{paymentHistory[0].receipt.bankAccountLast4}
                    {autoPay && <span className="text-sm ml-2">(Auto-Pay)</span>}
                  </>
                )
              : '—'}
          </p>
          <p className="text-base font-medium text-right">${nextPaymentAmount.toFixed(2)}</p>
        </motion.div>
      )}

      {/* Payment History Rows */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="divide-y divide-border"
          >
            {paymentHistory.map((payment, index) => {
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
                    "w-full px-6 py-4 grid grid-cols-3 gap-6 items-center bg-white transition-colors",
                    isClickable 
                      ? "hover:bg-muted/50 cursor-pointer" 
                      : "cursor-default"
                  )}
                >
                  <p className="text-base">{payment.date}</p>
                  <p className="text-base text-muted-foreground pl-16 flex items-center gap-1.5">
                    {hasBankInfo ? (
                      <>
                        {renderBankName(receipt!.bankName ?? '')} ••••{receipt!.bankAccountLast4}
                      </>
                    ) : (
                      receipt?.paymentMethod || '—'
                    )}
                  </p>
                  <p className="text-base font-medium text-right">
                    ${payment.amount.toFixed(2)}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border text-center">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-base text-foreground underline hover:text-accent transition-colors"
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

