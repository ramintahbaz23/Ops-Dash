export interface CallQueueItem {
  id: string;
  name: string;
  status: 'waiting' | 'active';
}

export interface RecentlyViewedCustomer {
  id: string;
  name: string;
}

export interface PaymentReceipt {
  referenceId: string;
  cardLast4: string;
  cardBrand: string;
  paymentMethod: string;
  transactionDate: string;
  transactionTime: string;
  bankAccountLast4?: string;
  bankName?: string;
}

export interface Payment {
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'upcoming';
  receipt?: PaymentReceipt;
}

export interface TranscriptMessage {
  id: string;
  type: 'customer' | 'system' | 'agent';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
  }[];
  metadata?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  accountNumber: string;
  currentBalance: number;
  utilityTotalBalance: number;
  paymentPlanBalance: number;
  nextPayment: number;
  nextPaymentDate: string;
  planLength: number;
  monthsRemaining: number;
  activePlan: boolean;
  autoPay: boolean;
  payments: Payment[];
  eligibleForExtension?: boolean;
  eligibleForRollIn?: boolean;
}

export const mockCustomer: Customer & {
  smsOptIn?: boolean
  languagePreference?: string
  internalClientId?: string
  amplitudeUserId?: string
  ownerPermissionStatus?: string
  isTestAccount?: boolean
} = {
  id: '142612-0005065',
  name: 'Sarah Johnson',
  email: 's.johnson@aol.com',
  phone: '(555) 123-4567',
  address: '2847 Sunset Blvd, Los Angeles, CA 90026',
  accountNumber: '#142612-0005065',
  currentBalance: 482.76,
  utilityTotalBalance: 724.15,
  paymentPlanBalance: 482.76,
  nextPayment: 120.69,
  nextPaymentDate: 'December 27th, 2025',
  planLength: 6,
  monthsRemaining: 4,
  activePlan: true,
  autoPay: true,
  eligibleForExtension: false,
  eligibleForRollIn: false,
  smsOptIn: true,
  languagePreference: 'English',
  internalClientId: 'CLT-142612-0005065',
  amplitudeUserId: 'amp-142612-0005065',
  ownerPermissionStatus: 'Owner',
  isTestAccount: false,
  payments: [
    { 
      date: 'December 27th, 2025', 
      amount: 120.69,
      status: 'paid',
      receipt: {
        referenceId: 'TXN-2025-12-27-001234',
        cardLast4: '4242',
        cardBrand: 'Visa',
        paymentMethod: 'Bank Account',
        transactionDate: 'December 27th, 2025',
        transactionTime: '10:34 AM',
        bankAccountLast4: '7892',
        bankName: 'Chase Bank',
      }
    },
    { 
      date: 'January 27th, 2026', 
      amount: 120.69,
      status: 'paid',
      receipt: {
        referenceId: 'TXN-2026-01-27-005678',
        cardLast4: '4242',
        cardBrand: 'Visa',
        paymentMethod: 'Bank Account',
        transactionDate: 'January 27th, 2026',
        transactionTime: '10:34 AM',
        bankAccountLast4: '4563',
        bankName: 'Bank of America',
      }
    },
    { 
      date: 'February 27th, 2026', 
      amount: 120.69,
      status: 'paid',
      receipt: {
        referenceId: 'TXN-2026-02-27-009012',
        cardLast4: '4242',
        cardBrand: 'Visa',
        paymentMethod: 'Bank Account',
        transactionDate: 'February 27th, 2026',
        transactionTime: '10:34 AM',
        bankAccountLast4: '2341',
        bankName: 'Wells Fargo',
      }
    },
    { 
      date: 'March 27th, 2026', 
      amount: 120.69,
      status: 'paid',
      receipt: {
        referenceId: 'TXN-2026-03-27-003456',
        cardLast4: '4242',
        cardBrand: 'Visa',
        paymentMethod: 'Bank Account',
        transactionDate: 'March 27th, 2026',
        transactionTime: '10:34 AM',
        bankAccountLast4: '7892',
        bankName: 'Chase Bank',
      }
    },
  ],
};

export const mockCallQueue: CallQueueItem[] = [
  { id: '1', name: 'David Cuthrell', status: 'waiting' },
  { id: '2', name: 'Chris Jones', status: 'waiting' },
];

export const mockLiveCall = {
  customer: mockCustomer,
  duration: '14:32',
  status: 'listening' as const,
  transcript: 'Hello, I was calling to see what my current balance is?',
  messages: [
    {
      id: '1',
      type: 'customer' as const,
      text: 'Hello, I was calling to see what my current balance is?',
      timestamp: '14:18',
    },
    {
      id: '2',
      type: 'system' as const,
      text: 'Your current balance is $482.76',
      timestamp: '14:19',
    },
    {
      id: '3',
      type: 'agent' as const,
      text: 'Caller may want the answers to these questions next: Next payment due date: 12/27/2025 Next payment amount: $120.69',
      timestamp: '14:19',
      metadata: 'Predictive',
    },
    {
      id: '4',
      type: 'customer' as const,
      text: "I think my next payment is coming up and I'm wondering if I can change the date?",
      timestamp: '14:20',
    },
    {
      id: '5',
      type: 'system' as const,
      text: 'Of course, I can help you with that. I see you have a payment of $120.69 due on December 27th. What date would work better for you?',
      timestamp: '14:21',
    },
    {
      id: '6',
      type: 'customer' as const,
      text: 'Could we move it to the 7th of January? That\'s when I get paid.',
      timestamp: '14:22',
    },
    {
      id: '7',
      type: 'agent' as const,
      text: 'Sarah has successfully completed 2 previous payments on time. Good payment history — consider offering flexibility',
      timestamp: '14:22',
      metadata: 'Payment History',
    },
    {
      id: '8',
      type: 'agent' as const,
      text: 'Sarah is eligible for a one-time reschedule. Moving payment to January 7th will shift all remaining payments by 11 days. No fees apply.',
      timestamp: '14:23',
      metadata: 'Eligibility Check',
      actions: [
        { label: 'Apply reschedule', variant: 'primary' as const },
        { label: 'View impact', variant: 'secondary' as const },
      ],
    },
    {
      id: '9',
      type: 'agent' as const,
      text: 'Reschedule Applied Successfully\n\nPayment dates have been updated:\nDec 27 → Jan 7, 2026 ($120.69)\nJan 27 → Feb 7, 2026 ($120.69)\nFeb 27 → Mar 7, 2026 ($120.69)\nMar 27 → Apr 7, 2026 ($120.69)\n\n→ Sarah has been notified via Email & SMS',
      timestamp: '14:24',
      metadata: 'Action Completed',
    },
  ] as TranscriptMessage[],
};

export interface LinkedAccount {
  id: string
  name: string
  address?: string
  accountNumber: string
}

export const mockLinkedAccounts: LinkedAccount[] = [
  {
    id: '142612-0005065',
    name: 'Sarah Johnson',
    address: '2847 Sunset Blvd, Los Angeles, CA 90026',
    accountNumber: '#142612-0005065'
  },
  {
    id: '142612-0005123',
    name: 'Sarah J. Johnson',
    address: '2847 Sunset Blvd, Los Angeles, CA 90026',
    accountNumber: '#142612-0005123'
  },
  {
    id: '142612-0005234',
    name: 'S. Johnson',
    accountNumber: '#142612-0005234'
  },
  {
    id: '142612-0005345',
    name: 'Sarah Johnson',
    address: '4521 Hollywood Blvd, Los Angeles, CA 90027',
    accountNumber: '#142612-0005345'
  }
];

export const mockRecentlyViewed: RecentlyViewedCustomer[] = [
  { id: '1', name: 'Michael Chen' },
  { id: '2', name: 'Emily Rodriguez' },
  { id: '3', name: 'David Thompson' },
];

