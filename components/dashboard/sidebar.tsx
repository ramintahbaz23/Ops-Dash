'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { mockLiveCall } from '@/lib/mock-data'
import type { RecentlyViewedCustomer } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface SidebarProps {
  hasLiveCall?: boolean
  callAnswered?: boolean
  onSearchChange?: (query: string, isFocused: boolean) => void
  currentCustomerName?: string
  currentCustomerId?: string
  recentlyViewed?: RecentlyViewedCustomer[]
  onSelectRecentCustomer?: (id: string) => void
  isTranscriptOpen?: boolean
  onToggleTranscript?: () => void
}

export function Sidebar({ hasLiveCall = true, callAnswered = false, onSearchChange, currentCustomerName, currentCustomerId, recentlyViewed = [], onSelectRecentCustomer, isTranscriptOpen = false, onToggleTranscript }: SidebarProps) {
  const [imageError, setImageError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const PULSE_MS = 2000
  const [pulseDelay, setPulseDelay] = useState('0s')
  useEffect(() => {
    setPulseDelay(`-${(Date.now() % PULSE_MS) / 1000}s`)
  }, [])

  return (
    <aside
      className={cn(
        "relative z-10 w-60 h-screen bg-sidebar border-r border-sidebar-border",
        "flex flex-col shrink-0",
        "shadow-[1px_0_8px_-2px_rgba(0,0,0,0.04),2px_0_12px_-4px_rgba(0,0,0,0.03)]"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded flex items-center justify-center overflow-hidden">
            {!imageError ? (
              <Image 
                src="/no_bg_white.png" 
                alt="PromisePay" 
                width={20} 
                height={20}
                className="rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-white text-sm font-bold">P</span>
            )}
          </div>
          <h2 className="text-base font-semibold text-sidebar-foreground">PromisePay</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              const newQuery = e.target.value
              setSearchQuery(newQuery)
              onSearchChange?.(newQuery, isSearchFocused)
            }}
            onFocus={() => {
              setIsSearchFocused(true)
              onSearchChange?.(searchQuery, true)
            }}
            onBlur={() => {
              setIsSearchFocused(false)
              onSearchChange?.(searchQuery, false)
            }}
            className={cn(
              "w-full pl-9 pr-3 py-2 text-base",
              "bg-background border border-border rounded-md shadow-inner",
              "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
              "placeholder:text-muted-foreground"
            )}
          />
        </div>
      </div>

      {/* Dashboard */}
      <div className="px-2 pt-1 pb-2 shrink-0">
        <button 
          className="w-full text-left px-3 py-2 rounded-md transition-colors text-base font-normal flex items-center gap-2"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E5E5E5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <svg data-testid="geist-icon" height={16} width={16} strokeLinejoin="round" viewBox="0 0 16 16" style={{ color: 'currentColor' }} fill="currentColor" aria-hidden>
            <path fillRule="evenodd" clipRule="evenodd" d="M2.5 5.5V2.5H5.5V5.5H2.5ZM1 2C1 1.44772 1.44772 1 2 1H6C6.55228 1 7 1.44772 7 2V6C7 6.55228 6.55228 7 6 7H2C1.44772 7 1 6.55228 1 6V2ZM2.5 13.5V10.5H5.5V13.5H2.5ZM1 10C1 9.44772 1.44772 9 2 9H6C6.55228 9 7 9.44772 7 10V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V10ZM10.5 2.5V5.5H13.5V2.5H10.5ZM10 1C9.44772 1 9 1.44772 9 2V6C9 6.55228 9.44772 7 10 7H14C14.5523 7 15 6.55228 15 6V2C15 1.44772 14.5523 1 14 1H10ZM10.5 13.5V10.5H13.5V13.5H10.5ZM9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V10Z" />
          </svg>
          Dashboard
        </button>
        {/* Current customer or live call pill - when call answered, show live call here instead */}
        {(callAnswered && hasLiveCall) ? (
          <div className="px-3 pt-1 pb-2">
            <div className="rounded-md px-3 py-2 flex items-center gap-2" style={{ backgroundColor: '#EBEBEB' }}>
              <p className="text-base font-normal">{mockLiveCall.customer.name}</p>
            </div>
          </div>
        ) : currentCustomerName ? (
          <div className="px-3 pt-1 pb-2">
            <div className="rounded-md px-3 py-2" style={{ backgroundColor: '#EBEBEB' }}>
              <p className="text-base font-normal">{currentCustomerName}</p>
            </div>
          </div>
        ) : null}
        {/* Call status strip - nested below active client, toggles transcript drawer */}
        {((callAnswered && hasLiveCall) || currentCustomerName) && onToggleTranscript && (
          <div className="pl-6 pr-2 pt-0 pb-2">
            <button
              type="button"
              onClick={onToggleTranscript}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2',
                'hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full shrink-0',
                  callAnswered ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-pulse'
                )}
                style={{ animationDelay: pulseDelay }}
              />
              <span
                className={cn(
                  'text-[10px] font-semibold uppercase tracking-wider',
                  callAnswered ? 'text-green-700' : 'text-blue-700'
                )}
                style={{ fontVariant: 'small-caps' }}
              >
                {callAnswered ? 'Call in progress' : 'Call waiting'}
              </span>
            </button>
          </div>
        )}
        {/* Recently Viewed */}
        {recentlyViewed.filter((c) => c.id !== currentCustomerId).length > 0 && (
          <div className="px-2 pt-4 pb-2 shrink-0">
            <p className="text-xs font-normal text-muted-foreground mb-2 px-3">RECENTLY VIEWED</p>
            <div className="space-y-1">
              {recentlyViewed.filter((c) => c.id !== currentCustomerId).map((customer) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-2 rounded-md transition-colors cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E5E5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => onSelectRecentCustomer?.(customer.id)}
                >
                  <p className="text-base font-normal">{customer.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Call & Call Queue Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Bottom Navigation */}
        <div className="px-2 pt-4 pb-4 border-t border-sidebar-border space-y-1">
          <button 
            className="w-full text-left px-3 py-2 rounded-md transition-colors text-base font-normal flex items-center gap-2"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E5E5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentColor' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M7.96452 2.5C11.0257 2.5 13.5 4.96643 13.5 8C13.5 11.0336 11.0257 13.5 7.96452 13.5C6.12055 13.5 4.48831 12.6051 3.48161 11.2273L3.03915 10.6217L1.828 11.5066L2.27046 12.1122C3.54872 13.8617 5.62368 15 7.96452 15C11.8461 15 15 11.87 15 8C15 4.13001 11.8461 1 7.96452 1C5.06835 1 2.57851 2.74164 1.5 5.23347V3.75V3H0V3.75V7.25C0 7.66421 0.335786 8 0.75 8H3.75H4.5V6.5H3.75H2.63724C3.29365 4.19393 5.42843 2.5 7.96452 2.5ZM8.75 5.25V4.5H7.25V5.25V7.8662C7.25 8.20056 7.4171 8.51279 7.6953 8.69825L9.08397 9.62404L9.70801 10.0401L10.5401 8.79199L9.91603 8.37596L8.75 7.59861V5.25Z" fill="currentColor" />
            </svg>
            Call history
          </button>
          <button 
            className="w-full text-left px-3 py-2 rounded-md transition-colors text-base font-normal flex items-center gap-2"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E5E5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentColor' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M0 1H0.75H5C6.2267 1 7.31583 1.58901 8 2.49963C8.68417 1.58901 9.7733 1 11 1H15.25H16V1.75V13V13.75H15.25H10.7426C10.1459 13.75 9.57361 13.9871 9.15165 14.409L8.53033 15.0303H7.46967L6.84835 14.409C6.42639 13.9871 5.8541 13.75 5.25736 13.75H0.75H0V13V1.75V1ZM7.25 4.75C7.25 3.50736 6.24264 2.5 5 2.5H1.5V12.25H5.25736C5.96786 12.25 6.65758 12.4516 7.25 12.8232V4.75ZM8.75 12.8232V4.75C8.75 3.50736 9.75736 2.5 11 2.5H14.5V12.25H10.7426C10.0321 12.25 9.34242 12.4516 8.75 12.8232Z" fill="currentColor" />
            </svg>
            Knowledge base
          </button>
        </div>
      </div>
    </aside>
  )
}

