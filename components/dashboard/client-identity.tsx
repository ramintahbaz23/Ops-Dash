'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Customer, mockLinkedAccounts } from '@/lib/mock-data'
import { LinkedAccountsModal } from './linked-accounts-modal'
import { EditCustomerModal } from './edit-customer-modal'
import { SendToCustomerDropdown } from './send-to-customer-dropdown'

interface ClientIdentityProps {
  customer: Customer
  onUpdate?: (updatedCustomer: Partial<Customer>) => void
}

export function ClientIdentity({ customer, onUpdate }: ClientIdentityProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLinkedAccounts, setShowLinkedAccounts] = useState(false)

  const handleDownloadActivityLog = () => {
    console.log('Download activity log')
  }

  const handleOpenAccountPage = () => {
    console.log('Open account page in app')
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-border">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
            <Image
              src={customer.avatarUrl ?? '/s_johnson.png'}
              alt={customer.name}
              width={80}
              height={80}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-2xl font-bold tracking-tight text-foreground leading-none">
              {customer.name}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
              {customer.accountNumber}
            </span>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="p-1 rounded hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Edit customer"
            >
              <svg data-testid="geist-icon" height={16} width={16} strokeLinejoin="round" viewBox="0 0 16 16" style={{ color: 'currentColor' }} fill="currentColor" aria-hidden>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.75 0.189331L12.2803 0.719661L15.2803 3.71966L15.8107 4.24999L15.2803 4.78032L5.15901 14.9016C4.45575 15.6049 3.50192 16 2.50736 16H0.75H0V15.25V13.4926C0 12.4981 0.395088 11.5442 1.09835 10.841L11.2197 0.719661L11.75 0.189331ZM11.75 2.31065L9.81066 4.24999L11.75 6.18933L13.6893 4.24999L11.75 2.31065ZM2.15901 11.9016L8.75 5.31065L10.6893 7.24999L4.09835 13.841C3.67639 14.2629 3.1041 14.5 2.50736 14.5H1.5V13.4926C1.5 12.8959 1.73705 12.3236 2.15901 11.9016ZM9 16H16V14.5H9V16Z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center flex-wrap">
            <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground pr-4 mr-4 border-r border-border last:border-r-0 last:pr-0 last:mr-0">
              <a
                href={`mailto:${customer.email}`}
                className="text-foreground font-medium hover:text-accent no-underline"
              >
                {customer.email}
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground pr-4 mr-4 border-r border-border last:border-r-0 last:pr-0 last:mr-0">
              <button
                type="button"
                onClick={() => setShowLinkedAccounts(true)}
                className="text-foreground font-medium hover:text-accent no-underline bg-transparent border-0 p-0 cursor-pointer"
              >
                {customer.phone}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground pr-4 mr-4 border-r border-border last:border-r-0 last:pr-0 last:mr-0">
              <span>{customer.address}</span>
            </div>
          </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 shrink-0 pt-0.5">
          <SendToCustomerDropdown customer={customer} />
        </div>
      </div>

      <LinkedAccountsModal
        isOpen={showLinkedAccounts}
        onClose={() => setShowLinkedAccounts(false)}
        phoneNumber={customer.phone}
        linkedAccounts={mockLinkedAccounts.filter((account) => account.id !== customer.id)}
        onAccountClick={(accountId) => {
          console.log('Clicked account:', accountId)
        }}
      />

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
    </>
  )
}
