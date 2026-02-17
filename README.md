# Ops Dash - PromisePay Dashboard

A modern operations dashboard built with Next.js, inspired by Notion's design system and based on the Figma design.

## Features

- 🎨 **Notion-style UI** - Clean, minimal design with Notion's color scheme and spacing
- 📱 **Collapsible Sidebar** - Smooth animations for sidebar collapse/expand
- 🎭 **Framer Motion Animations** - Smooth transitions and micro-interactions
- 🔤 **Geist Font** - Modern typography using Vercel's Geist font family
- 📊 **Dashboard Components** - Metric cards, payment tables, action menus
- 🎯 **Live Call Panel** - Real-time call management interface
- 🌓 **Dark Mode Ready** - Color scheme supports both light and dark modes

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Geist Font** - Vercel's modern font family

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
│   ├── layout.tsx          # Root layout with Geist fonts
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles + Notion colors
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

## Design System

### Colors
- Uses Notion's color palette with CSS variables
- Supports light and dark modes
- Accent color: `#3b5bdb` (blue)

### Typography
- Font: Geist Sans (via `geist` package)
- Sizes follow Notion's typography scale

### Spacing
- Based on Notion's 4px grid system
- Generous padding and gaps for readability

### Animations
- Smooth transitions using Framer Motion
- Hover effects on interactive elements
- Staggered animations for list items

## Customization

### Colors
Edit `app/globals.css` to customize the color scheme.

### Components
All components are in `components/dashboard/` and can be easily customized.

### Mock Data
Update `lib/mock-data.ts` to change the dashboard data.

## License

MIT






