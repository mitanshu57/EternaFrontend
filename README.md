# Token Trading Table - Axiom Trade Replica

A pixel-perfect replica of Axiom Trade's token discovery table built with Next.js 14, TypeScript, and modern React patterns.

## Features

### Core Features
- ✅ All token columns (New pairs, Final Stretch, Migrated)
- ✅ Interactive UI components: Popover, Tooltip, Modal
- ✅ Advanced sorting functionality
- ✅ Real-time price updates via WebSocket mock
- ✅ Smooth color transitions for price changes
- ✅ Multiple loading states: Skeleton, Shimmer, Progressive loading
- ✅ Error boundaries for graceful error handling
- ✅ Responsive design (320px - desktop)

### Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **UI Components**: Radix UI / shadcn/ui
- **Icons**: Lucide React

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

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # Reusable UI components (shadcn/ui style)
│   ├── token-table/       # Token table specific components
│   └── providers.tsx      # App providers (Redux, React Query)
├── hooks/                 # Custom React hooks
│   ├── use-token-data.ts  # Token data fetching hook
│   └── use-websocket.ts   # WebSocket connection hook
├── lib/                   # Utility functions
│   ├── utils.ts           # General utilities
│   ├── mock-data.ts       # Mock data generator
│   └── websocket-mock.ts  # WebSocket mock implementation
├── store/                 # Redux store
│   ├── store.ts           # Store configuration
│   ├── tokenSlice.ts      # Token state slice
│   └── hooks.ts           # Typed Redux hooks
└── types/                 # TypeScript type definitions
    └── token.ts           # Token-related types
```

## Architecture

### Atomic Design
The project follows atomic design principles:
- **Atoms**: Basic UI components (Button, Input, Skeleton)
- **Molecules**: Composite components (TableHeader, TableCell)
- **Organisms**: Complex components (TokenRow, TokenTradingTable)
- **Templates**: Page layouts

### Performance Optimizations
- ✅ Memoized components (React.memo)
- ✅ useCallback for event handlers
- ✅ useMemo for expensive computations
- ✅ Debounced search input
- ✅ Optimized re-renders with Redux selectors
- ✅ Code splitting with Next.js

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 640px (sm), 768px (md), 1024px (lg)
- Progressive column hiding on smaller screens
- Touch-friendly interactions

## Key Features Implementation

### Real-time Price Updates
- WebSocket mock simulates real-time price changes
- Smooth color transitions (green for up, red for down)
- Updates every 2 seconds for demonstration

### Loading States
- **Skeleton**: Initial table loading
- **Shimmer**: Animated loading effect
- **Progressive**: Data loads incrementally
- **Error Boundary**: Catches and displays errors gracefully

### Interactive Components
- **Popover**: Token actions menu
- **Tooltip**: Additional information on hover
- **Modal**: Detailed token information
- **Sorting**: Click column headers to sort

## Performance Metrics

Target metrics:
- Lighthouse score: ≥ 90 (mobile & desktop)
- Interaction latency: < 100ms
- No layout shifts (CLS = 0)
- Optimized bundle size

## Code Quality

- ✅ TypeScript strict mode
- ✅ Comprehensive type definitions
- ✅ Error handling throughout
- ✅ Documented complex logic
- ✅ DRY principles
- ✅ Reusable components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

This is a demonstration project. For production use, consider:
- Adding real API integration
- Implementing authentication
- Adding unit and integration tests
- Setting up CI/CD pipeline
- Adding analytics

