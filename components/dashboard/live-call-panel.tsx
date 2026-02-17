'use client'

import { motion } from 'framer-motion'
import { Phone, PhoneOff, Pause, ArrowRightLeft } from 'lucide-react'
import { mockLiveCall } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function LiveCallPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col bg-card border-l border-border"
    >
      {/* Header */}
      <div className="bg-muted border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Phone size={14} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Live call - {mockLiveCall.customer.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Listening & Analyzing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">{mockLiveCall.duration}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 flex gap-3 border-b border-border">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-6 py-2 bg-white border border-accent text-accent rounded-lg text-base font-medium hover:bg-accent/5 transition-colors"
        >
          <Pause size={16} className="inline mr-2" />
          Hold call
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-6 py-2 bg-white border border-accent text-accent rounded-lg text-base font-medium hover:bg-accent/5 transition-colors"
        >
          <ArrowRightLeft size={16} className="inline mr-2" />
          Transfer
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-6 py-2 bg-white border border-accent text-accent rounded-lg text-base font-medium hover:bg-accent/5 transition-colors"
        >
          <PhoneOff size={16} className="inline mr-2" />
          End call
        </motion.button>
      </div>

      {/* Transcript */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex gap-3 mb-4">
          <div className="w-5 h-5 bg-foreground rounded-full flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-base leading-relaxed">{mockLiveCall.transcript}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}





