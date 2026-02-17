'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink } from 'lucide-react'
import { Customer } from '@/lib/mock-data'
import { InfoDialog } from './info-dialog'

interface EditCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer
  onSave?: (updatedCustomer: Partial<Customer>) => void
  onDownloadActivityLog?: () => void
  onOpenAccountPage?: () => void
}

export function EditCustomerModal({ 
  isOpen, 
  onClose, 
  customer,
  onSave,
  onDownloadActivityLog,
  onOpenAccountPage
}: EditCustomerModalProps) {
  const [editedData, setEditedData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    smsOptIn: (customer as any).smsOptIn ?? true,
    languagePreference: (customer as any).languagePreference ?? 'English',
  })

  const handleSave = () => {
    if (onSave) {
      onSave(editedData)
    }
    onClose()
  }

  const handleCancel = () => {
    setEditedData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      smsOptIn: (customer as any).smsOptIn ?? true,
      languagePreference: (customer as any).languagePreference ?? 'English',
    })
    onClose()
  }

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
            style={{ overflow: 'visible' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col" style={{ overflow: 'visible' }}>
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <h2 className="text-lg font-semibold">Make changes for {customer.name}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4" style={{ overflowX: 'visible' }}>
                <div className="space-y-6">
                  {/* Editable Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={editedData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2">Phone Number</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="tel"
                          value={editedData.phone}
                          onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                          className="flex-1 px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                        <div className="flex items-center gap-2 relative">
                          <InfoDialog
                            title=""
                            content={`${customer.name} is ${editedData.smsOptIn ? 'opted in' : 'opted out'} to receive SMS`}
                          >
                            <span className="text-base text-muted-foreground whitespace-nowrap hover:text-foreground transition-colors cursor-default">SMS:</span>
                          </InfoDialog>
                          <button
                            type="button"
                            onClick={() => setEditedData({ ...editedData, smsOptIn: !editedData.smsOptIn })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border ${
                              editedData.smsOptIn 
                                ? 'bg-green-500 border-green-500' 
                                : 'bg-gray-200 border-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                editedData.smsOptIn ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2">Address</label>
                      <input
                        type="text"
                        value={editedData.address}
                        onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2">Language Preference</label>
                      <select
                        value={editedData.languagePreference}
                        onChange={(e) => setEditedData({ ...editedData, languagePreference: e.target.value })}
                        className="w-full px-3 py-2 pr-8 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_0.5rem_center] bg-no-repeat"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Korean">Korean</option>
                        <option value="Armenian">Armenian</option>
                        <option value="Tagalog">Tagalog</option>
                      </select>
                    </div>
                  </div>

                  {/* Non-editable Fields */}
                  <div className="border-t border-border pt-4 space-y-4">
                    <div>
                      <label className="block text-base font-medium mb-2 text-muted-foreground">Account Number</label>
                      <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-base">
                        {customer.accountNumber}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-muted-foreground">Owner Permission Status</label>
                      <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-base">
                        {(customer as any).ownerPermissionStatus ?? 'Owner'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-muted-foreground">Account Type</label>
                      <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-base">
                        {(customer as any).accountType ?? 'Residential'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-muted-foreground">Internal Client ID</label>
                      <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-base">
                        {(customer as any).internalClientId ?? 'CLT-142612-0005065'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-muted-foreground">Amplitude User ID</label>
                      <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-base">
                        {(customer as any).amplitudeUserId ?? 'amp-142612-0005065'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-muted-foreground">Secondary Verification</label>
                      <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-base">
                        {(customer as any).secondaryVerification ?? 'memb'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-muted-foreground">Is this a Test account</label>
                      <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-base">
                        {(customer as any).isTestAccount ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="border-t border-border pt-4 flex flex-col gap-3">
                    <button
                      onClick={onDownloadActivityLog}
                      className="text-base text-foreground underline hover:text-accent transition-colors flex items-center gap-1.5 w-fit"
                    >
                      <Download size={16} />
                      Download activity log
                    </button>
                    <button
                      onClick={onOpenAccountPage}
                      className="text-base text-foreground underline hover:text-accent transition-colors flex items-center gap-1.5 w-fit"
                    >
                      <ExternalLink size={16} />
                      Open account page in app
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

