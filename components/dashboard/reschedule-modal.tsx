'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface RescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  currentDate: string
  onConfirm: (newDate: string) => void
}

export function RescheduleModal({ 
  isOpen, 
  onClose, 
  currentDate,
  onConfirm 
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Calculate eligible dates (4 options: 1 week, 2 weeks, 1 month, 2 months from today)
  const getEligibleDates = () => {
    const today = new Date()
    const dates = []
    
    // 1 week from today
    const week1 = new Date(today)
    week1.setDate(today.getDate() + 7)
    dates.push({ label: '1 week from now', date: week1, value: week1.toISOString().split('T')[0] })
    
    // 2 weeks from today
    const week2 = new Date(today)
    week2.setDate(today.getDate() + 14)
    dates.push({ label: '2 weeks from now', date: week2, value: week2.toISOString().split('T')[0] })
    
    // 1 month from today
    const month1 = new Date(today)
    month1.setMonth(today.getMonth() + 1)
    dates.push({ label: '1 month from now', date: month1, value: month1.toISOString().split('T')[0] })
    
    // 2 months from today
    const month2 = new Date(today)
    month2.setMonth(today.getMonth() + 2)
    dates.push({ label: '2 months from now', date: month2, value: month2.toISOString().split('T')[0] })
    
    return dates
  }

  const eligibleDates = getEligibleDates()

  const handleOptionSelect = (dateValue: string) => {
    setSelectedOption(dateValue)
    setNewDate(dateValue)
  }

  const handleDateChange = (dateValue: string) => {
    setNewDate(dateValue)
    setSelectedOption(null) // Clear button selection when using calendar
  }

  const handleConfirm = () => {
    if (newDate) {
      onConfirm(newDate)
      onClose()
    }
  }

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-lg w-full flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <h2 className="text-lg font-semibold">Reschedule Payment Plan</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-base text-muted-foreground mb-1">Current next payment date:</p>
                    <p className="text-base font-medium">{currentDate}</p>
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-2">Select New Payment Date</label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {eligibleDates.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleOptionSelect(option.value)}
                          className={`px-4 py-3 rounded-md border transition-colors text-left ${
                            selectedOption === option.value
                              ? 'bg-accent text-accent-foreground border-accent'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          <div className="text-sm font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDateDisplay(option.value)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-2">Or choose a custom date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={today}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                    {newDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {formatDateDisplay(newDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end shrink-0 gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!newDate}
                  className="px-4 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

