'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  accountNumber: string
  zip: string
}

interface SearchResultsPanelProps {
  isOpen: boolean
  query: string
  results: SearchResult[]
  activeIndex: number
  onSelect: (result: SearchResult) => void
  onClose: () => void
}

function highlightMatch(text: string, query: string) {
  if (!query) return text
  
  // Escape special regex characters in query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => {
    // Check if this part matches the query (case-insensitive)
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark key={index} className="bg-yellow-200/50 px-0.5 rounded">
          {part}
        </mark>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export function SearchResultsPanel({
  isOpen,
  query,
  results,
  activeIndex,
  onSelect,
  onClose
}: SearchResultsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || results.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          data-search-results-panel
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed left-[240px] top-0 w-96 h-screen bg-card border-r border-border shadow-xl z-30 overflow-y-auto"
        >
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold">Search Results</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </p>
            </div>

            <div className="space-y-0">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onMouseDown={(e) => {
                    e.preventDefault() // Prevent input blur
                    onSelect(result)
                  }}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted transition-colors cursor-pointer",
                    index < results.length - 1 && "border-b border-border",
                    index === activeIndex && "bg-muted"
                  )}
                >
                  <div className="font-semibold text-base mb-1">
                    {highlightMatch(result.name, query)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Account #{result.accountNumber} · ZIP {result.zip}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

