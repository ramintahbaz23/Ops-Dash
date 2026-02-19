'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { mockLiveCall, mockRecentlyViewed } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface SidebarProps {
  hasLiveCall?: boolean
  callAnswered?: boolean
  onSearchChange?: (query: string, isFocused: boolean) => void
  currentCustomerName?: string
}

export function Sidebar({ hasLiveCall = true, callAnswered = false, onSearchChange, currentCustomerName }: SidebarProps) {
  const [imageError, setImageError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <aside
      className={cn(
        "w-60 h-screen bg-sidebar border-r border-sidebar-border",
        "flex flex-col"
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
          <h2 className="text-base font-semibold">PromisePay</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2 shrink-0">
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
              "bg-background border border-border rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
              "placeholder:text-muted-foreground"
            )}
          />
        </div>
      </div>

      {/* Dashboard */}
      <div className="px-2 py-2 shrink-0">
        <button 
          className="w-full text-left px-3 py-2 rounded-md transition-colors text-base font-medium flex items-center gap-2"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E5E5E5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentColor' }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12.5 6.56062L8.00001 2.06062L3.50001 6.56062V13.5L6.00001 13.5V11C6.00001 9.89539 6.89544 8.99996 8.00001 8.99996C9.10458 8.99996 10 9.89539 10 11V13.5L12.5 13.5V6.56062ZM13.78 5.71933L8.70711 0.646409C8.31659 0.255886 7.68342 0.255883 7.2929 0.646409L2.21987 5.71944C2.21974 5.71957 2.21961 5.7197 2.21949 5.71982L0.469676 7.46963L-0.0606537 7.99996L1.00001 9.06062L1.53034 8.53029L2.00001 8.06062V14.25V15H2.75001L6.00001 15H7.50001H8.50001H10L13.25 15H14V14.25V8.06062L14.4697 8.53029L15 9.06062L16.0607 7.99996L15.5303 7.46963L13.7806 5.71993C13.7804 5.71973 13.7802 5.71953 13.78 5.71933ZM8.50001 11V13.5H7.50001V11C7.50001 10.7238 7.72386 10.5 8.00001 10.5C8.27615 10.5 8.50001 10.7238 8.50001 11Z" fill="currentColor" />
          </svg>
          Dashboard
        </button>
        {/* Current customer or live call pill - when call answered, show live call here instead */}
        {(callAnswered && hasLiveCall) ? (
          <div className="px-3 py-2">
            <div className="rounded-md px-3 py-2 flex items-center gap-2" style={{ backgroundColor: '#EBEBEB' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
              <p className="text-base font-medium">{mockLiveCall.customer.name}</p>
            </div>
          </div>
        ) : currentCustomerName ? (
          <div className="px-3 py-2">
            <div className="rounded-md px-3 py-2" style={{ backgroundColor: '#EBEBEB' }}>
              <p className="text-base font-medium">{currentCustomerName}</p>
            </div>
          </div>
        ) : null}
        {/* Recently Viewed */}
        {mockRecentlyViewed.length > 0 && (
          <div className="px-2 py-2 shrink-0">
            <p className="text-sm text-muted-foreground mb-2 px-3">Recently viewed</p>
            <div className="space-y-1">
              {mockRecentlyViewed.map((customer) => (
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
                >
                  <p className="text-base">{customer.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Call & Call Queue Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Live Call Section - Only show when active and not yet answered (waiting state) */}
        {hasLiveCall && !callAnswered && (
          <div className="px-6 pt-2 pb-4">
            <p className="text-sm text-muted-foreground mb-2">Live call</p>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-500" />
                <p className="text-base font-medium">{mockLiveCall.customer.name}</p>
              </div>
            </motion.div>
          </div>
        )}


        {/* Bottom Navigation */}
        <div className="px-2 pt-2 pb-4 border-t border-sidebar-border space-y-1">
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

