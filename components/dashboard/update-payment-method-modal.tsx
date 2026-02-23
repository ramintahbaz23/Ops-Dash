'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface UpdatePaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  currentMethod?: string
  customerAddress?: string
  onConfirm: (method: string, accountLast4: string, billingAddress?: string) => void
}

export function UpdatePaymentMethodModal({ 
  isOpen, 
  onClose, 
  currentMethod,
  customerAddress = '',
  onConfirm 
}: UpdatePaymentMethodModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'venmo' | 'paypal' | 'zelle'>('bank')
  const [accountLast4, setAccountLast4] = useState('')
  const [bankName, setBankName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [venmoHandle, setVenmoHandle] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [zelleEmail, setZelleEmail] = useState('')
  const [useSameAddress, setUseSameAddress] = useState(true)
  const [billingAddress, setBillingAddress] = useState(customerAddress)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) setValidationError(null)
  }, [isOpen])

  const handleClose = () => {
    setValidationError(null)
    onClose()
  }

  const handleConfirm = () => {
    setValidationError(null)
    let method = ''
    let last4 = ''

    switch (paymentMethod) {
      case 'bank':
        if (!bankName?.trim()) {
          setValidationError('Bank name is required to continue.')
          return
        }
        if (accountLast4.length !== 4) {
          setValidationError('Please enter the last 4 digits of the account.')
          return
        }
        method = `${bankName} ••••${accountLast4}`
        last4 = accountLast4
        break
      case 'card':
        if (cardNumber.replace(/\s/g, '').length < 13) {
          setValidationError('Please enter a valid card number.')
          return
        }
        if (!expiryDate) {
          setValidationError('Expiry date is required.')
          return
        }
        if (!cvv) {
          setValidationError('CVV is required.')
          return
        }
        if (!cardholderName?.trim()) {
          setValidationError('Cardholder name is required.')
          return
        }
        const cardNum = cardNumber.replace(/\s/g, '')
        last4 = cardNum.slice(-4)
        method = `Card ••••${last4}`
        break
      case 'venmo':
        if (!venmoHandle?.trim()) {
          setValidationError('Venmo handle is required.')
          return
        }
        method = `Venmo @${venmoHandle}`
        last4 = venmoHandle.slice(-4)
        break
      case 'paypal':
        if (!paypalEmail?.trim()) {
          setValidationError('PayPal email is required.')
          return
        }
        method = `PayPal ${paypalEmail}`
        last4 = paypalEmail.slice(-4)
        break
      case 'zelle':
        if (!zelleEmail?.trim()) {
          setValidationError('Zelle email or phone is required.')
          return
        }
        method = `Zelle ${zelleEmail}`
        last4 = zelleEmail.slice(-4)
        break
    }

    if (method && last4) {
      const finalBillingAddress = paymentMethod === 'venmo' ? undefined : (useSameAddress ? customerAddress : billingAddress)
      if (paymentMethod !== 'venmo' && !useSameAddress && !billingAddress?.trim()) {
        setValidationError('Please enter a billing address or use the same as account.')
        return
      }
      onConfirm(method, last4, finalBillingAddress)
      handleClose()
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
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
            onClick={handleClose}
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
                <h2 className="text-lg font-semibold">Update Payment Method</h2>
                <button
                  onClick={handleClose}
                  className="min-h-[44px] min-w-[44px] p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {currentMethod && (
                    <div>
                      <p className="text-base text-muted-foreground mb-1">Current method:</p>
                      <p className="text-base font-medium">{currentMethod}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-base font-medium mb-2">Payment Method Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('bank'); setValidationError(null) }}
                        className={`min-h-[44px] px-4 py-2 rounded-md border transition-colors text-sm ${
                          paymentMethod === 'bank'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        Bank Account
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('card'); setValidationError(null) }}
                        className={`min-h-[44px] px-4 py-2 rounded-md border transition-colors text-sm ${
                          paymentMethod === 'card'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        Credit/Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('venmo'); setValidationError(null) }}
                        className={`min-h-[44px] px-4 py-2 rounded-md border transition-colors text-sm ${
                          paymentMethod === 'venmo'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        Venmo
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('paypal'); setValidationError(null) }}
                        className={`min-h-[44px] px-4 py-2 rounded-md border transition-colors text-sm ${
                          paymentMethod === 'paypal'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        PayPal
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('zelle'); setValidationError(null) }}
                        className={`min-h-[44px] px-4 py-2 rounded-md border transition-colors text-sm ${
                          paymentMethod === 'zelle'
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        Zelle
                      </button>
                    </div>
                  </div>

                  {/* Bank Account Fields */}
                  {paymentMethod === 'bank' && (
                    <>
                      <div>
                        <label className="block text-base font-medium mb-2">Bank Name</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => {
                            setBankName(e.target.value)
                            setValidationError(null)
                          }}
                          placeholder="e.g., Chase Bank"
                          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium mb-2">Account Last 4 Digits</label>
                        <input
                          type="text"
                          value={accountLast4}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                            setAccountLast4(value)
                            setValidationError(null)
                          }}
                          placeholder="1234"
                          maxLength={4}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>
                    </>
                  )}

                  {/* Credit/Debit Card Fields */}
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="block text-base font-medium mb-2">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value)
                            setCardNumber(formatted)
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-base font-medium mb-2">Expiry Date</label>
                          <input
                            type="text"
                            value={expiryDate}
                            onChange={(e) => {
                              const formatted = formatExpiryDate(e.target.value)
                              setExpiryDate(formatted)
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-base font-medium mb-2">CVV</label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                              setCvv(value)
                            }}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-medium mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>
                    </>
                  )}

                  {/* Venmo Fields */}
                  {paymentMethod === 'venmo' && (
                    <div>
                      <label className="block text-base font-medium mb-2">Venmo Handle</label>
                      <div className="flex items-center gap-2">
                        <span className="text-base text-muted-foreground">@</span>
                        <input
                          type="text"
                          value={venmoHandle}
                          onChange={(e) => {
                            setVenmoHandle(e.target.value)
                            setValidationError(null)
                          }}
                          placeholder="username"
                          className="flex-1 px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>
                    </div>
                  )}

                  {/* PayPal Fields */}
                  {paymentMethod === 'paypal' && (
                    <div>
                      <label className="block text-base font-medium mb-2">PayPal Email</label>
                      <input
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => {
                          setPaypalEmail(e.target.value)
                          setValidationError(null)
                        }}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                  )}

                  {/* Zelle Fields */}
                  {paymentMethod === 'zelle' && (
                    <div>
                      <label className="block text-base font-medium mb-2">Zelle Email or Phone</label>
                      <input
                        type="text"
                        value={zelleEmail}
                        onChange={(e) => {
                          setZelleEmail(e.target.value)
                          setValidationError(null)
                        }}
                        placeholder="email@example.com or (555) 123-4567"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                  )}

                  {/* Billing Address (not for Venmo) */}
                  {paymentMethod !== 'venmo' && (
                    <div className="border-t border-border pt-4">
                      <label className="block text-base font-medium mb-2">Billing Address</label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={useSameAddress}
                            onChange={() => {
                              setUseSameAddress(true)
                              setBillingAddress(customerAddress)
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-base">Use same address as account</span>
                          {customerAddress && (
                            <span className="text-sm text-muted-foreground">({customerAddress})</span>
                          )}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!useSameAddress}
                            onChange={() => setUseSameAddress(false)}
                            className="w-4 h-4"
                          />
                          <span className="text-base">Use different billing address</span>
                        </label>
                        {!useSameAddress && (
                          <div>
                            <textarea
                              value={billingAddress}
                              onChange={(e) => {
                              setBillingAddress(e.target.value)
                              setValidationError(null)
                            }}
                              placeholder="Enter billing address"
                              rows={3}
                              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation error banner */}
              {validationError && (
                <div className="mx-6 mt-2 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
                  {validationError}
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end shrink-0 gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="min-h-[44px] min-w-[44px] px-4 py-2 text-base font-medium bg-muted border border-border text-foreground hover:bg-muted/80 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={
                    (paymentMethod === 'bank' && (!accountLast4 || accountLast4.length !== 4 || !bankName)) ||
                    (paymentMethod === 'card' && (!cardNumber || cardNumber.replace(/\s/g, '').length < 13 || !expiryDate || !cvv || !cardholderName)) ||
                    (paymentMethod === 'venmo' && !venmoHandle) ||
                    (paymentMethod === 'paypal' && !paypalEmail) ||
                    (paymentMethod === 'zelle' && !zelleEmail) ||
                    (paymentMethod !== 'venmo' && !useSameAddress && !billingAddress)
                  }
                  className="min-h-[44px] min-w-[44px] px-4 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Method
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

