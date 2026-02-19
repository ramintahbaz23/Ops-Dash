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
          className="px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors whitespace-nowrap"
        >
          Send to customer
        </button>
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50"
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
