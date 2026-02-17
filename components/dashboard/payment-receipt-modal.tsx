'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PaymentReceipt } from '@/lib/mock-data'

interface PaymentReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  receipt: PaymentReceipt
  amount: number
  date: string
}

export function PaymentReceiptModal({ 
  isOpen, 
  onClose, 
  receipt, 
  amount,
  date 
}: PaymentReceiptModalProps) {
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
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-md w-full">
              {/* Receipt Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Receipt</h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-md hover:bg-gray-200 transition-colors text-gray-500"
                    aria-label="Close receipt"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-500">PromisePay</p>
              </div>

              {/* Receipt Content - Receipt-like format */}
              <div className="px-6 py-6 space-y-4">
                {/* Total Amount - Prominent */}
                <div className="text-center py-4 border-b-2 border-dashed border-gray-300">
                  <p className="text-base text-gray-600 mb-1">Total Amount Paid</p>
                  <p className="text-3xl font-bold text-gray-900">${amount.toFixed(2)}</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-3 text-base">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Date of Payment:</span>
                    <span className="font-medium text-gray-900">{date}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Reference ID:</span>
                    <span className="font-mono font-medium text-gray-900 text-sm">{receipt.referenceId}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900">{receipt.paymentMethod}</span>
                  </div>

                  {receipt.bankName && receipt.bankAccountLast4 ? (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Bank Account:</span>
                      <span className="font-medium text-gray-900">
                        {receipt.bankName} ••••{receipt.bankAccountLast4}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Card:</span>
                      <span className="font-medium text-gray-900">
                        {receipt.cardBrand} •••• {receipt.cardLast4}
                      </span>
                    </div>
                  )}
                </div>

                {/* Receipt Footer */}
                <div className="pt-4 mt-4 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    Transaction Time: {receipt.transactionTime}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Thank you for your payment
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

