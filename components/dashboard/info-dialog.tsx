'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface InfoDialogProps {
  title: string
  content: string
  children: React.ReactNode
  className?: string
}

export function InfoDialog({ title, content, children, className }: InfoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }
  }, [isOpen])

  const dialogContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[100] w-80"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="bg-black rounded-lg shadow-lg">
            {/* Header */}
            {title && (
              <div className="px-4 pt-3 pb-2 rounded-t-lg">
                <h3 className="text-base font-medium text-white">{title}</h3>
              </div>
            )}

            {/* Content */}
            <div className={cn("px-4", title ? "pb-3" : "py-3")}>
              <div className="text-sm text-white leading-relaxed space-y-1">
                {content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("relative", className)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
      </div>
      {typeof window !== 'undefined' && createPortal(dialogContent, document.body)}
    </>
  )
}

