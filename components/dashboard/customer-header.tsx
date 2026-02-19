'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Edit2 } from 'lucide-react'
import { Customer, mockLinkedAccounts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { InfoDialog } from './info-dialog'
import { LinkedAccountsModal } from './linked-accounts-modal'
import { EditCustomerModal } from './edit-customer-modal'
import { SendToCustomerDropdown } from './send-to-customer-dropdown'

interface CustomerHeaderProps {
  customer: Customer
  onUpdate?: (updatedCustomer: Partial<Customer>) => void
  showTranscription?: boolean
  onToggleTranscription?: () => void
}

export function CustomerHeader({ customer, onUpdate, showTranscription = false, onToggleTranscription }: CustomerHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLinkedAccounts, setShowLinkedAccounts] = useState(false)

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
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
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
            className="ml-2 px-2 py-1 rounded-md border border-neutral-300 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
            aria-label="Edit customer details"
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </motion.button>
          <SendToCustomerDropdown customer={customer} />
        </div>
        {!showTranscription && onToggleTranscription && (
          <button
            onClick={onToggleTranscription}
            className="px-4 py-2 text-base font-medium bg-muted border border-neutral-300 text-foreground hover:bg-muted/80 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            aria-label="Toggle live transcription"
          >
            <div className="w-2 h-2 rounded-full animate-pulse bg-blue-500 shrink-0" aria-hidden />
            <span>Call waiting</span>
          </button>
        )}
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

    </div>
  )
}

