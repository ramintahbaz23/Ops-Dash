'use client'

import { useState, useRef, useEffect } from 'react'
import { Mail, Phone, MapPin, Edit2, MessageSquare } from 'lucide-react'
import { Customer, mockLinkedAccounts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { InfoDialog } from './info-dialog'
import { LinkedAccountsModal } from './linked-accounts-modal'
import { EditCustomerModal } from './edit-customer-modal'
import { SendEmailModal } from './send-email-modal'
import { SendSMSModal } from './send-sms-modal'

interface CustomerHeaderProps {
  customer: Customer
  onUpdate?: (updatedCustomer: Partial<Customer>) => void
  showTranscription?: boolean
  onToggleTranscription?: () => void
}

export function CustomerHeader({ customer, onUpdate, showTranscription = false, onToggleTranscription }: CustomerHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSendToCustomer, setShowSendToCustomer] = useState(false)
  const [showLinkedAccounts, setShowLinkedAccounts] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showSMSModal, setShowSMSModal] = useState(false)
  const sendToCustomerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sendToCustomerRef.current && !sendToCustomerRef.current.contains(event.target as Node)) {
        setShowSendToCustomer(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAction = (action: string) => {
    setShowSendToCustomer(false)
    
    switch (action) {
      case 'Send email':
        setShowEmailModal(true)
        break
      case 'Send SMS':
        setShowSMSModal(true)
        break
      case 'Copy payment link':
        // Copy to clipboard
        if (typeof window !== 'undefined' && navigator.clipboard) {
          const paymentLink = `${window.location.origin}/pay/${customer.accountNumber}`
          navigator.clipboard.writeText(paymentLink).then(() => {
            // Trigger toast via custom event
            window.dispatchEvent(new CustomEvent('showToast', { 
              detail: { 
                type: 'copy', 
                message: 'Payment link copied to clipboard' 
              } 
            }))
          })
        }
        break
      case 'Account page':
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', { 
            detail: { 
              type: 'sent', 
              message: 'Account page sent to user' 
            } 
          }))
        }
        break
      case 'FAQ':
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', { 
            detail: { 
              type: 'sent', 
              message: 'FAQ sent to user' 
            } 
          }))
        }
        break
      case 'Application':
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', { 
            detail: { 
              type: 'sent', 
              message: 'Application sent to user' 
            } 
          }))
        }
        break
    }
  }

  const handleEmailSend = () => {
    // Trigger toast via custom event - user will explain later
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { 
          type: 'email', 
          message: 'Email sent' 
        } 
      }))
    }
  }

  const handleSMSSend = () => {
    // Trigger toast via custom event - user will explain later
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { 
          type: 'sms', 
          message: 'SMS sent' 
        } 
      }))
    }
  }

  const sendToCustomerActions = [
    { label: 'Send email' },
    { label: 'Send SMS' },
    { label: 'Copy payment link' },
    { label: 'Account page' },
    { label: 'FAQ' },
    { label: 'Application' },
  ]

  const handleDownloadActivityLog = () => {
    // Handle download activity log
    console.log('Download activity log')
  }

  const handleOpenAccountPage = () => {
    // Handle open account page in app
    console.log('Open account page in app')
    // In a real app, this would open the user-facing account page
  }

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-medium">{customer.name}</h1>
        {customer.activePlan && (
          <InfoDialog
            title="Active Payment Plan"
            content="This customer has an active payment plan. The plan allows them to pay their balance in installments over a set period. Payment dates and amounts are scheduled automatically."
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </InfoDialog>
        )}
        <span className="text-sm text-muted-foreground">{customer.accountNumber}</span>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowEditModal(true)}
          className="ml-2 px-2 py-1 rounded-md border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
          aria-label="Edit customer details"
        >
          <Edit2 size={14} />
          <span>Edit</span>
        </motion.button>
      </div>
      <div className="flex items-center justify-between gap-6 text-base text-muted-foreground">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <InfoDialog
              title=""
              content="View accounts tied to this phone number"
            >
              <button
                onClick={() => setShowLinkedAccounts(true)}
                className="underline cursor-pointer hover:text-foreground transition-colors"
              >
                {customer.phone}
              </button>
            </InfoDialog>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{customer.address}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Send to Customer Dropdown */}
          <div className="relative" ref={sendToCustomerRef}>
            <button
              onClick={() => setShowSendToCustomer(!showSendToCustomer)}
              className="px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors whitespace-nowrap"
            >
              Send to customer
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showSendToCustomer && (
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

          {/* Live Transcript Button */}
          {!showTranscription && onToggleTranscription && (
            <button
              onClick={onToggleTranscription}
              className="px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap"
              aria-label="Toggle live transcription"
            >
              <MessageSquare size={18} />
              <span>Live Transcript</span>
            </button>
          )}
        </div>
      </div>

      {/* Linked Accounts Modal */}
      <LinkedAccountsModal
        isOpen={showLinkedAccounts}
        onClose={() => setShowLinkedAccounts(false)}
        phoneNumber={customer.phone}
        linkedAccounts={mockLinkedAccounts.filter(account => account.id !== customer.id)}
        onAccountClick={(accountId) => {
          // Handle account click - in a real app, this would navigate to that account
          console.log('Clicked account:', accountId)
        }}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        customer={customer}
        onSave={(updatedData) => {
          if (onUpdate) {
            onUpdate(updatedData)
          }
        }}
        onDownloadActivityLog={handleDownloadActivityLog}
        onOpenAccountPage={handleOpenAccountPage}
      />

      {/* Send Email Modal */}
      <SendEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        recipientName={customer.name}
        recipientEmail={customer.email}
        onSend={handleEmailSend}
      />

      {/* Send SMS Modal */}
      <SendSMSModal
        isOpen={showSMSModal}
        onClose={() => setShowSMSModal(false)}
        recipientName={customer.name}
        recipientPhone={customer.phone}
        onSend={handleSMSSend}
      />
    </div>
  )
}

