# Ops Dash - PromisePay Dashboard

A Next.js operations dashboard for PromisePay. Built from the Figma spec.

## Features

- **Collapsible sidebar** – Expand/collapse navigation
- **Dashboard** – Metric cards, payment tables, action menus
- **Live call panel** – Real-time call management
- **Dark mode** – Light and dark color schemes

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
ops-dash/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles and theme
├── components/
│   └── dashboard/
│       ├── sidebar.tsx      # Collapsible sidebar
│       ├── customer-header.tsx
│       ├── metric-card.tsx
│       ├── payment-table.tsx
│       ├── action-menu.tsx
│       └── live-call-panel.tsx
├── lib/
│   ├── utils.ts            # Utility functions
│   └── mock-data.ts        # Mock data for dashboard
└── package.json
```

## Theme

Colors and spacing can be adjusted in `app/globals.css`.

## Customization

### Components
All components are in `components/dashboard/` and can be easily customized.

### Mock Data
Update `lib/mock-data.ts` to change the dashboard data.

## License

MIT
