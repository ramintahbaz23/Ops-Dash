'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronRight, Phone, Mic, Pause, ArrowRightLeft, PhoneOff, X } from 'lucide-react'
import { mockLiveCall, TranscriptMessage } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface LiveTranscriptionPanelProps {
  isOpen: boolean
  onClose: () => void
  onCallAnsweredChange?: (answered: boolean) => void
  onApplyReschedule?: () => void
}

function TranscriptMessageItem({ 
  message, 
  index,
  onApplyReschedule,
  onViewImpact
}: { 
  message: TranscriptMessage
  index: number
  onApplyReschedule?: () => void
  onViewImpact?: () => void
}) {
  const getMessageStyles = () => {
    switch (message.type) {
      case 'customer':
        return {
          dot: 'bg-transparent',
          bg: 'bg-transparent',
          text: 'text-foreground',
          label: mockLiveCall.customer.name,
        }
      case 'system':
        return {
          dot: 'bg-transparent',
          bg: 'bg-transparent',
          text: 'text-foreground',
          label: 'Call Center',
        }
      case 'agent':
        return {
          dot: 'bg-black',
          bg: 'bg-muted border border-border',
          text: 'text-foreground',
          label: 'Agent',
        }
    }
  }

  const styles = getMessageStyles()

  const handleActionClick = (action: NonNullable<TranscriptMessage['actions']>[number]) => {
    if (action.label === 'Apply reschedule' && onApplyReschedule) {
      onApplyReschedule()
    } else if (action.label === 'View impact' && onViewImpact) {
      onViewImpact()
    } else if (action.onClick) {
      action.onClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex gap-3", message.type === 'agent' && "p-4 rounded-lg", styles.bg)}
    >
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
        styles.dot
      )}>
        {message.type === 'agent' ? (
          <Image 
            src="/no_bg_white.png" 
            alt="Agent" 
            width={18} 
            height={18}
            className="rounded-full"
          />
        ) : message.type === 'system' ? (
          <Image 
            src="/gradient_profile.png" 
            alt="Call Center" 
            width={24} 
            height={24}
            className="rounded-full"
          />
        ) : message.type === 'customer' ? (
          <Image 
            src="/s_johnson.png" 
            alt={mockLiveCall.customer.name} 
            width={24} 
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="w-2 h-2 rounded-full bg-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-muted-foreground">{styles.label}</p>
          {message.metadata && (
            <span className="text-sm text-muted-foreground">• {message.metadata}</span>
          )}
        </div>
        <p className={cn("text-base leading-relaxed whitespace-pre-line", styles.text)}>
          {message.text}
        </p>
        {message.actions && message.actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {message.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    "px-4 py-2 rounded-md text-base font-medium transition-colors",
                    action.variant === 'primary'
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-white border border-border text-foreground hover:bg-muted"
                  )}
                >
                  {action.label}
                </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function LiveTranscriptionPanel({ isOpen, onClose, onCallAnsweredChange, onApplyReschedule }: LiveTranscriptionPanelProps) {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [callDuration, setCallDuration] = useState<number>(0) // Duration in seconds
  const [showImpactInfo, setShowImpactInfo] = useState<boolean>(false)
  const [callAnswered, setCallAnswered] = useState<boolean>(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Find the index of the message with action buttons (Apply reschedule)
  const actionMessageIndex = mockLiveCall.messages.findIndex(
    msg => msg.actions && msg.actions.some(a => a.label === 'Apply reschedule')
  )

  // Find the success message (reschedule applied)
  const successMessage = mockLiveCall.messages.find(
    msg => msg.text.includes('Reschedule Applied Successfully')
  )

  const handleApplyReschedule = () => {
    // Show the next message (success message) after clicking Apply reschedule
    if (actionMessageIndex >= 0 && visibleMessages === actionMessageIndex + 1) {
      setVisibleMessages(actionMessageIndex + 2)
    }
    onApplyReschedule?.()
  }

  const handleViewImpact = () => {
    setShowImpactInfo(true)
  }

  // Forward-looking copy for the impact modal (what will happen if they apply)
  const impactModalContent = `If you apply this reschedule, the following will happen:

Payment dates will change:
Dec 27 → Jan 7, 2026 ($120.69)
Jan 27 → Feb 7, 2026 ($120.69)
Feb 27 → Mar 7, 2026 ($120.69)
Mar 27 → Apr 7, 2026 ($120.69)

Sarah will be notified via Email & SMS`

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Auto-scroll to bottom when new messages appear or impact info is shown
  useEffect(() => {
    if (scrollContainerRef.current && (visibleMessages > 0 || showImpactInfo)) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [visibleMessages, showImpactInfo])

  // Reset call state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setCallAnswered(false)
      setCallDuration(0)
      setVisibleMessages(0)
      setShowImpactInfo(false)
      onCallAnsweredChange?.(false)
    }
  }, [isOpen, onCallAnsweredChange])

  // Timer for call duration - only start when call is answered
  useEffect(() => {
    // Only start timer if panel is open AND call has been answered
    if (!isOpen || !callAnswered) {
      // Reset timer if call is not answered
      if (!callAnswered) {
        setCallDuration(0)
      }
      return
    }

    // Start timer when call is answered
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [isOpen, callAnswered])

  useEffect(() => {
    if (!isOpen || !callAnswered) {
      return
    }

    // Reset when call is answered
    setVisibleMessages(0)
    setShowImpactInfo(false)

    // Show messages progressively with delays, but stop at the action message
    const timeouts: NodeJS.Timeout[] = []
    
    mockLiveCall.messages.forEach((_, index) => {
      // Stop at the action message - don't show it or anything after automatically
      if (index >= actionMessageIndex) {
        return
      }
      
      // Much slower delays: 4-5 seconds between messages
      const delay = (index + 1) * 4000 + Math.random() * 1000 // 4-5 seconds per message
      
      const timeout = setTimeout(() => {
        setVisibleMessages(prev => Math.max(prev, index + 1))
      }, delay)
      
      timeouts.push(timeout)
    })

    // Show the action message after all previous messages (but not the success message)
    if (actionMessageIndex >= 0) {
      const delay = actionMessageIndex * 4000 + Math.random() * 1000
      const timeout = setTimeout(() => {
        setVisibleMessages(actionMessageIndex + 1)
      }, delay)
      timeouts.push(timeout)
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [isOpen, callAnswered, actionMessageIndex])

  const handleAnswerCall = () => {
    setCallAnswered(true)
    setCallDuration(0) // Reset timer to 0 when answering
    onCallAnsweredChange?.(true)
  }

  const impactModal = showImpactInfo && typeof document !== 'undefined' && createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        onClick={() => setShowImpactInfo(false)}
        className="fixed inset-0 bg-black/50 z-[100]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="bg-card border border-border rounded-lg shadow-xl max-w-lg w-full flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
            <h2 className="text-lg font-semibold">Reschedule impact</h2>
            <button
              onClick={() => setShowImpactInfo(false)}
              className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <p className="text-base leading-relaxed whitespace-pre-line text-foreground">
              {impactModalContent}
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end shrink-0">
            <button
              onClick={() => setShowImpactInfo(false)}
              className="px-4 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  )

  return (
    <>
    <motion.aside
      animate={{ 
        width: isOpen ? 520 : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "relative z-40 h-full shrink-0 overflow-hidden",
        "bg-card border-l border-border shadow-xl",
        "flex flex-col",
        !isOpen && "border-0 pointer-events-none"
      )}
    >
      {isOpen && (
        <div className="w-[520px] flex flex-col h-full">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  callAnswered ? "bg-green-500" : "bg-blue-500"
                )} />
                <div>
                  <h2 className="text-base font-semibold">{callAnswered ? 'Live call' : 'Call waiting...'}</h2>
                  <p className="text-sm text-muted-foreground">{mockLiveCall.customer.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Close transcription panel"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Call Control Buttons */}
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex gap-2">
                <motion.button
                  whileHover={callAnswered ? { scale: 1.05 } : {}}
                  whileTap={callAnswered ? { scale: 0.95 } : {}}
                  disabled={!callAnswered}
                  className={cn(
                    "flex-1 px-4 py-2 bg-white border border-border text-foreground rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2",
                    callAnswered ? "hover:bg-muted cursor-pointer" : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Pause size={16} />
                  Hold Call
                </motion.button>
                <motion.button
                  whileHover={callAnswered ? { scale: 1.05 } : {}}
                  whileTap={callAnswered ? { scale: 0.95 } : {}}
                  disabled={!callAnswered}
                  className={cn(
                    "flex-1 px-4 py-2 bg-white border border-border text-foreground rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2",
                    callAnswered ? "hover:bg-muted cursor-pointer" : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ArrowRightLeft size={16} />
                  Transfer
                </motion.button>
                {!callAnswered ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnswerCall}
                    className="flex-1 px-4 py-2 bg-green-50 border border-green-200 text-green-600 rounded-lg text-base font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    Answer Call
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-base font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <PhoneOff size={16} />
                    End Call
                  </motion.button>
                )}
              </div>
            </div>

            {/* Call Info */}
            <div className="px-6 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  {callAnswered ? (
                    <>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{formatDuration(callDuration)}</span>
                    </>
                  ) : (
                    <span className="font-medium">
                      Click to answer
                      <span className="inline-block w-4 ml-1">
                        <span className="inline-block animate-dots" style={{ animationDelay: '0s' }}>.</span>
                        <span className="inline-block animate-dots" style={{ animationDelay: '0.2s' }}>.</span>
                        <span className="inline-block animate-dots" style={{ animationDelay: '0.4s' }}>.</span>
                      </span>
                    </span>
                  )}
                </div>
                {callAnswered && (
                  <div className="flex items-center gap-2">
                    <Mic size={16} className="text-foreground" />
                    <span className="text-sm text-foreground font-medium">Transcribing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Content */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="space-y-4">
                {mockLiveCall.messages.slice(0, visibleMessages).map((message, index) => (
                  <TranscriptMessageItem 
                    key={message.id} 
                    message={message} 
                    index={index}
                    onApplyReschedule={handleApplyReschedule}
                    onViewImpact={handleViewImpact}
                  />
                ))}
              </div>
            </div>
        </div>
      )}
    </motion.aside>
    {impactModal}
    </>
  )
}

