'use client'

import { use, useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ClientIdentity } from '@/components/dashboard/client-identity'
import { MetricCard } from '@/components/dashboard/metric-card'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { PaymentTable } from '@/components/dashboard/payment-table'
import { LiveTranscriptionPanel } from '@/components/dashboard/live-transcription-panel'
import { SearchResultsPanel } from '@/components/dashboard/search-results-panel'
import { NotEligibleModal } from '@/components/dashboard/not-eligible-modal'
import { MakePaymentModal } from '@/components/dashboard/make-payment-modal'
import { UpdatePaymentMethodModal } from '@/components/dashboard/update-payment-method-modal'
import { RescheduleModal } from '@/components/dashboard/reschedule-modal'
import { RollInBalanceModal } from '@/components/dashboard/roll-in-balance-modal'
import { mockCustomer, Customer, getMockCustomerById, mockRecentlyViewed, type RecentlyViewedCustomer } from '@/lib/mock-data'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  accountNumber: string
  zip: string
}

// TODO: Replace with real API call
function getSearchResults(query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('sarah')) {
    return [
      { id: '1', name: 'Sarah Johnson LLC', accountNumber: '3284915521', zip: '45224' },
      { id: '2', name: 'Sarah Properties Group', accountNumber: '7712049983', zip: '45229' },
    ]
  }
  
  if (lowerQuery.includes('john')) {
    return [
      { id: '3', name: 'John Smith Holdings', accountNumber: '1192837465', zip: '45218' },
      { id: '4', name: 'John & Sons Management', accountNumber: '9081726354', zip: '45220' },
    ]
  }
  
  // Generic results filtered by substring match
  const genericResults = [
    { id: '5', name: '1514 Cedar LLC', accountNumber: '3228315635', zip: '45224' },
    { id: '6', name: '514 Prospect LLC', accountNumber: '1613849442', zip: '45229' },
  ]
  
  return genericResults.filter(result => 
    result.name.toLowerCase().includes(lowerQuery)
  )
}

type DashboardProps = {
  params?: Promise<Record<string, string | string[] | undefined>>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default function Dashboard({ params, searchParams }: DashboardProps = {}) {
  // Next.js 15+: params and searchParams are Promises; unwrap to avoid enumeration warnings
  use(params ?? Promise.resolve({}))
  use(searchParams ?? Promise.resolve({}))

  const [customer, setCustomer] = useState<Customer>(mockCustomer)
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedCustomer[]>(mockRecentlyViewed)
  const [showTranscription, setShowTranscription] = useState(false)
  const [callAnswered, setCallAnswered] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activeResultIndex, setActiveResultIndex] = useState(0)
  const searchAreaRef = useRef<HTMLDivElement>(null)
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'copy' | 'sent' | 'email' | 'sms' } | null>(null)
  const [showManagePlan, setShowManagePlan] = useState(false)
  const managePlanRef = useRef<HTMLDivElement>(null)
  const [showNotEligibleModal, setShowNotEligibleModal] = useState(false)
  const [showMakePaymentModal, setShowMakePaymentModal] = useState(false)
  const [showUpdateMethodModal, setShowUpdateMethodModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showRollInModal, setShowRollInModal] = useState(false)

  const handleCustomerUpdate = (updatedFields: Partial<Customer>) => {
    setCustomer((prev) => ({ ...prev, ...updatedFields }))
    // In a real app, you would make an API call here to save the changes
    console.log('Customer updated:', updatedFields)
  }

  const handleSearchChange = (query: string, isFocused: boolean) => {
    setSearchQuery(query)
    setIsSearchFocused(isFocused)
    setActiveResultIndex(0)
  }

  const handleSelectRecentCustomer = (id: string) => {
    const nextCustomer = getMockCustomerById(id)
    if (!nextCustomer) return
    // Add current customer to recently viewed (at front, dedupe)
    setRecentlyViewed((prev) => [
      { id: customer.id, name: customer.name },
      ...prev.filter((c) => c.id !== customer.id),
    ].slice(0, 10))
    setCustomer(nextCustomer)
  }

  const searchResults = searchQuery.length > 0 ? getSearchResults(searchQuery) : []
  const showResultsPanel = isSearchFocused && searchQuery.length > 0 && searchResults.length > 0

  const handleSelectResult = (result: SearchResult) => {
    console.log('Selected result:', result)
    // TODO: Navigate to account or perform action
    setSearchQuery('')
    setIsSearchFocused(false)
  }

  // Handle keyboard navigation
  useEffect(() => {
    if (!showResultsPanel) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveResultIndex((prev) => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveResultIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter' && activeResultIndex >= 0) {
        e.preventDefault()
        handleSelectResult(searchResults[activeResultIndex])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showResultsPanel, searchResults, activeResultIndex])

  // Handle click-away - check if click is outside both sidebar and results panel
  useEffect(() => {
    if (!showResultsPanel) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const resultsPanel = document.querySelector('[data-search-results-panel]')
      
      // Check if click is outside both the search area (sidebar) and results panel
      const isOutsideSearchArea = searchAreaRef.current && !searchAreaRef.current.contains(target)
      const isOutsideResultsPanel = resultsPanel && !resultsPanel.contains(target)
      
      // Also check if clicking on the results panel itself (should not close)
      if (isOutsideSearchArea && isOutsideResultsPanel) {
        setIsSearchFocused(false)
      }
    }

    // Use a small delay to avoid immediate closing when clicking results
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showResultsPanel])

  // Handle toast notifications
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: 'copy' | 'sent' | 'email' | 'sms'; message: string }>
      const { type, message } = customEvent.detail
      setNotificationToast({ type, message })
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setNotificationToast(null)
      }, 3000)
    }

    window.addEventListener('showToast', handleShowToast)
    return () => {
      window.removeEventListener('showToast', handleShowToast)
    }
  }, [])

  // Close manage plan dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (managePlanRef.current && !managePlanRef.current.contains(event.target as Node)) {
        setShowManagePlan(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleManagePlanAction = (action: string) => {
    setShowManagePlan(false)
    
    switch (action) {
      case 'Make payment':
        setShowMakePaymentModal(true)
        break
      case 'Update payment method':
        setShowUpdateMethodModal(true)
        break
      case 'Reschedule':
        setShowRescheduleModal(true)
        break
      case 'Roll-in balance':
        setShowRollInModal(true)
        break
      case 'Not eligible for extension':
        setShowNotEligibleModal(true)
        break
      case 'One time extension':
        // Handle extension - for now just show a message
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showToast', { 
            detail: { 
              type: 'sent', 
              message: 'Extension request submitted' 
            } 
          }))
        }
        break
    }
  }

  const handleMakePayment = (amount: number, paymentType: 'plan' | 'utility' | 'both', paymentMethod: string) => {
    setCustomer((prev) => {
      const updated = { ...prev }
      
      if (paymentType === 'plan' || paymentType === 'both') {
        const planAmount = paymentType === 'both' 
          ? Math.min(amount, updated.nextPayment)
          : amount
        updated.paymentPlanBalance = Math.max(0, updated.paymentPlanBalance - planAmount)
        updated.nextPayment = Math.max(0, updated.nextPayment - planAmount)
      }
      
      if (paymentType === 'utility' || paymentType === 'both') {
        const utilityAmount = paymentType === 'both'
          ? Math.min(amount - (paymentType === 'both' ? Math.min(amount, updated.nextPayment) : 0), updated.utilityTotalBalance)
          : amount
        updated.utilityTotalBalance = Math.max(0, updated.utilityTotalBalance - utilityAmount)
      }
      
      return updated
    })
    
    if (typeof window !== 'undefined') {
      const paymentTypeText = paymentType === 'both' ? 'payment plan and utility bill' : paymentType === 'plan' ? 'payment plan' : 'utility bill'
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { 
          type: 'sent', 
          message: `Payment of $${amount.toFixed(2)} to ${paymentTypeText} processed successfully` 
        } 
      }))
    }
  }

  const handleUpdatePaymentMethod = (method: string, accountLast4: string, billingAddress?: string) => {
    // Update the payment method in the most recent payment receipt
    setCustomer((prev) => {
      const updated = { ...prev }
      if (updated.payments.length > 0 && updated.payments[0].receipt) {
        updated.payments[0].receipt = {
          ...updated.payments[0].receipt,
          paymentMethod: method,
          bankAccountLast4: method.includes('••••') ? accountLast4 : undefined,
          bankName: method.includes('Bank') ? method.split(' ')[0] : undefined
        }
      }
      return updated
    })
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { 
          type: 'sent', 
          message: 'Payment method updated successfully' 
        } 
      }))
    }
  }

  const handleReschedule = (newDate: string) => {
    // Format date for display
    const date = new Date(newDate)
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    setCustomer((prev) => ({
      ...prev,
      nextPaymentDate: formattedDate
    }))
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { 
          type: 'sent', 
          message: `Payment plan rescheduled to ${formattedDate}` 
        } 
      }))
    }
  }

  const handleRollInBalance = (amount: number) => {
    setCustomer((prev) => {
      const updated = { ...prev }
      // Add to payment plan balance
      updated.paymentPlanBalance = updated.paymentPlanBalance + amount
      // Reduce utility balance
      updated.utilityTotalBalance = Math.max(0, updated.utilityTotalBalance - amount)
      // Recalculate next payment (distribute across remaining months)
      const remainingMonths = updated.planLength - updated.monthsRemaining
      if (remainingMonths > 0) {
        updated.nextPayment = (updated.paymentPlanBalance / remainingMonths)
      }
      return updated
    })
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { 
          type: 'sent', 
          message: `$${amount.toFixed(2)} rolled into payment plan` 
        } 
      }))
    }
  }

  const managePlanActions = [
    { label: 'Make payment' },
    { label: 'Update payment method' },
    { label: 'Reschedule' },
    { label: 'Roll-in balance' },
    ...(customer.eligibleForExtension 
      ? [{ label: 'One time extension' }]
      : [{ label: 'Not eligible for extension' }]
    ),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background" ref={searchAreaRef}>
      {/* Sidebar + transcript drawer wrapper: expands when transcript is open */}
      <div
        className={cn(
          'flex h-screen shrink-0 transition-all duration-300',
          showTranscription ? 'w-[760px]' : 'w-60'
        )}
      >
        <Sidebar
          hasLiveCall={true}
          callAnswered={callAnswered}
          onSearchChange={handleSearchChange}
          currentCustomerName={customer.name}
          currentCustomerId={customer.id}
          recentlyViewed={recentlyViewed}
          onSelectRecentCustomer={handleSelectRecentCustomer}
          isTranscriptOpen={showTranscription}
          onToggleTranscript={() => setShowTranscription(!showTranscription)}
        />
        {/* Transcript drawer: 520px panel to the right of sidebar; shadow over main, below sidenav */}
        <div
          className={cn(
            'relative z-0 h-full shrink-0 overflow-hidden',
            showTranscription ? 'w-[520px] opacity-100 pointer-events-auto' : 'w-0 opacity-0 pointer-events-none'
          )}
          style={{
            transition: showTranscription
              ? 'width 0.3s ease, opacity 0.2s ease 0.15s'
              : 'width 0.3s ease, opacity 0.2s ease',
            boxShadow: showTranscription ? '2px 0 12px -2px rgba(0,0,0,0.05), 4px 0 16px -4px rgba(0,0,0,0.03)' : 'none',
          }}
        >
          {showTranscription ? (
            <div className="w-[520px] h-full">
              <LiveTranscriptionPanel
                isOpen={showTranscription}
                onClose={() => setShowTranscription(false)}
                onCallAnsweredChange={setCallAnswered}
                onApplyReschedule={() => handleCustomerUpdate({ nextPaymentDate: 'January 7th, 2025' })}
              />
            </div>
          ) : null}
        </div>
      </div>
      <SearchResultsPanel
        isOpen={showResultsPanel}
        query={searchQuery}
        results={searchResults}
        activeIndex={activeResultIndex}
        onSelect={handleSelectResult}
        onClose={() => setIsSearchFocused(false)}
      />
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <main
          className={cn(
            'overflow-y-auto pt-7 px-7 pb-8 relative transition-all duration-300 flex-1',
            showTranscription ? '' : ''
          )}
        >
        <ClientIdentity customer={customer} onUpdate={handleCustomerUpdate} />

        {/* Notification Toast */}
        <AnimatePresence>
          {notificationToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-md shadow-lg",
                notificationToast.type === 'copy' || notificationToast.type === 'sent' || notificationToast.type === 'email' || notificationToast.type === 'sms'
                  ? "text-white"
                  : "bg-card border border-border"
              )}
              style={
                notificationToast.type === 'copy' || notificationToast.type === 'sent' || notificationToast.type === 'email' || notificationToast.type === 'sms'
                  ? { backgroundColor: '#000000', color: '#ffffff' }
                  : {}
              }
            >
              <p className="text-base font-medium">{notificationToast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metric Cards */}
        <p className="text-xs font-semibold tracking-widest text-muted-foreground mt-10 mb-2">PAYMENT PLAN</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 mb-6">
          <BalanceCard
            utilityTotalBalance={customer.utilityTotalBalance}
            paymentPlanBalance={customer.paymentPlanBalance}
            rounded="left"
          />
          <MetricCard
            title="Next payment"
            value={`$${customer.nextPayment.toFixed(2)}`}
            subtitle={`Due ${customer.nextPaymentDate}`}
            rounded="none"
          />
          <MetricCard
            title="Plan length"
            value={`${customer.planLength - customer.monthsRemaining} of ${customer.planLength}`}
            subtitle="Months remaining"
            rounded="right"
          />
        </div>

        {/* Payment plan schedule */}
        <div className="mb-6 mt-8">
          {/* Action bar: summary + primary CTA */}
          <div className="mb-4 bg-white border border-border rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-base text-muted-foreground">
              Next auto-payment of ${customer.nextPayment.toFixed(2)} on{' '}
              {(() => {
                const d = customer.nextPaymentDate.replace(/(\d+)(st|nd|rd|th),/, '$1,')
                try {
                  const date = new Date(d)
                  if (!Number.isNaN(date.getTime())) {
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                } catch (_) {}
                return customer.nextPaymentDate
              })()}{' '}
              via{' '}
              {customer.payments[0]?.receipt?.bankName && customer.payments[0]?.receipt?.bankAccountLast4
                ? `${customer.payments[0].receipt.bankName.replace(/\s+Bank$/, '')} ••••${customer.payments[0].receipt.bankAccountLast4}`
                : customer.payments[0]?.receipt?.paymentMethod
                  ? customer.payments[0].receipt.paymentMethod
                  : 'payment method'}
              . Make changes or process a payment now.
            </p>
            <div className="relative shrink-0" ref={managePlanRef}>
              <button
                type="button"
                onClick={() => setShowManagePlan(!showManagePlan)}
                className="min-h-[44px] px-5 py-2.5 text-base font-semibold bg-black text-white hover:bg-black/90 rounded-md transition-colors whitespace-nowrap"
              >
                Manage plan
              </button>
              <AnimatePresence>
                {showManagePlan && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 left-auto top-full mt-2 w-64 bg-card border border-border rounded-md shadow-lg z-50"
                  >
                    <div className="py-1">
                      {managePlanActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleManagePlanAction(action.label)}
                          className="w-full min-h-[44px] px-4 py-2 text-base text-left hover:bg-muted transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-xs font-semibold tracking-widest text-muted-foreground mt-10 mb-2 uppercase">Payment activity</p>
          <PaymentTable 
            nextPaymentDate={customer.nextPaymentDate}
            nextPaymentAmount={customer.nextPayment}
            paymentHistory={customer.payments}
            autoPay={customer.autoPay}
            eligibleForExtension={customer.eligibleForExtension}
            onPayNow={() => setShowMakePaymentModal(true)}
          />
        </div>

        {/* Data Info - z-0 so it sits behind the live call drawer */}
        <div className="fixed bottom-4 right-4 z-0 text-xs text-muted-foreground space-y-0.5">
          <div>Last time data received: Feb 3, 2026, 8:02 PM EST</div>
          <div>Last time account balance updated: Feb 3, 2026, 7:51 PM EST</div>
        </div>
      </main>
      </div>

      {/* Manage Plan Modals */}
      <NotEligibleModal
        isOpen={showNotEligibleModal}
        onClose={() => setShowNotEligibleModal(false)}
      />
      <MakePaymentModal
        isOpen={showMakePaymentModal}
        onClose={() => setShowMakePaymentModal(false)}
        nextPaymentAmount={customer.nextPayment}
        utilityTotalBalance={customer.utilityTotalBalance}
        currentPaymentMethod={
          customer.payments[0]?.receipt?.bankName && customer.payments[0]?.receipt?.bankAccountLast4
            ? `${customer.payments[0].receipt.bankName} ••••${customer.payments[0].receipt.bankAccountLast4}`
            : customer.payments[0]?.receipt?.paymentMethod
        }
        onConfirm={handleMakePayment}
      />
      <UpdatePaymentMethodModal
        isOpen={showUpdateMethodModal}
        onClose={() => setShowUpdateMethodModal(false)}
        currentMethod={
          customer.payments[0]?.receipt?.bankName && customer.payments[0]?.receipt?.bankAccountLast4
            ? `${customer.payments[0].receipt.bankName} ••••${customer.payments[0].receipt.bankAccountLast4}`
            : customer.payments[0]?.receipt?.paymentMethod
        }
        customerAddress={customer.address}
        onConfirm={handleUpdatePaymentMethod}
      />
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        currentDate={customer.nextPaymentDate}
        onConfirm={handleReschedule}
      />
      <RollInBalanceModal
        isOpen={showRollInModal}
        onClose={() => setShowRollInModal(false)}
        utilityBalance={customer.utilityTotalBalance}
        currentPlanBalance={customer.paymentPlanBalance}
        onConfirm={handleRollInBalance}
      />
    </div>
  )
}

