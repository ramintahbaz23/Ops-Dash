'use client'

import { useState, useRef, useEffect } from 'react'
import { Customer } from '@/lib/mock-data'
import { motion, AnimatePresence } from 'framer-motion'
import { SendEmailModal } from './send-email-modal'
import { SendSMSModal } from './send-sms-modal'

interface SendToCustomerDropdownProps {
  customer: Customer
}

const sendToCustomerActions = [
  { label: 'Send email' },
  { label: 'Send SMS' },
  { label: 'Copy payment link' },
  { label: 'Account page' },
  { label: 'FAQ' },
  { label: 'Application' },
]

export function SendToCustomerDropdown({ customer }: SendToCustomerDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showSMSModal, setShowSMSModal] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAction = (action: string) => {
    setShowDropdown(false)
    switch (action) {
      case 'Send email':
        setShowEmailModal(true)
        break
      case 'Send SMS':
        setShowSMSModal(true)
        break
      case 'Copy payment link':
        if (typeof window !== 'undefined' && navigator.clipboard) {
          const paymentLink = `${window.location.origin}/pay/${customer.accountNumber}`
          navigator.clipboard.writeText(paymentLink).then(() => {
            window.dispatchEvent(new CustomEvent('showToast', {
              detail: { type: 'copy', message: 'Payment link copied to clipboard' },
            }))
          })
        }
        break
      case 'Account page':
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: { type: 'sent', message: 'Account page sent to user' },
          }))
        }
        break
      case 'FAQ':
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: { type: 'sent', message: 'FAQ sent to user' },
          }))
        }
        break
      case 'Application':
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: { type: 'sent', message: 'Application sent to user' },
          }))
        }
        break
    }
  }

  const handleEmailSend = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { type: 'email', message: 'Email sent' },
      }))
    }
  }

  const handleSMSSend = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { type: 'sms', message: 'SMS sent' },
      }))
    }
  }

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="min-h-[44px] px-5 py-2.5 rounded-md border border-neutral-300 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-base font-semibold"
        >
          <svg data-testid="geist-icon" height={16} width={16} viewBox="0 0 16 16" fill="currentColor" className="shrink-0" aria-hidden>
            <path fillRule="evenodd" clipRule="evenodd" d="M14.7477 0.293701L0.747695 5.2937L0.730713 6.70002L6.81589 9.04047C6.88192 9.06586 6.93409 9.11804 6.95948 9.18406L9.29994 15.2692L10.7063 15.2523L15.7063 1.25226L14.7477 0.293701ZM7.31426 7.62503L3.15693 6.02605L12.1112 2.8281L7.31426 7.62503ZM8.37492 8.68569L9.9739 12.843L13.1719 3.88876L8.37492 8.68569Z" />
          </svg>
          <span>Send</span>
        </button>
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50"
            >
              <div className="py-1">
                {sendToCustomerActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action.label)}
                    className="w-full px-4 py-2 text-base text-left hover:bg-muted transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SendEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        recipientName={customer.name}
        recipientEmail={customer.email}
        onSend={handleEmailSend}
      />
      <SendSMSModal
        isOpen={showSMSModal}
        onClose={() => setShowSMSModal(false)}
        recipientName={customer.name}
        recipientPhone={customer.phone}
        onSend={handleSMSSend}
      />
    </>
  )
}
