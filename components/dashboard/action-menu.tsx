'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionItem {
  label: string
  onClick?: () => void
}

interface ActionMenuProps {
  title: string
  items: ActionItem[]
  className?: string
}

export function ActionMenu({ title, items, className }: ActionMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn("bg-card border border-border rounded-md overflow-hidden", className)}
    >
      {/* Header */}
      <div className="bg-muted border-b border-border px-3 py-2">
        <p className="text-base font-medium text-muted-foreground">{title}</p>
      </div>

      {/* Items */}
      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={item.onClick}
            className="w-full px-3 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
          >
            <span className="text-base">{item.label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}





