# Travel.pk Flight Results Page

A flight search results page built with Next.js 14 App Router and TypeScript for Travel.pk Pakistan flight booking platform.

## Setup

### 1. Install Dependencies
```bash
npm install

open in browser
http://localhost:3000/air/search?simulate=ok

URL States (Testing)
State	URL
Normal (OK)	/air/search?simulate=ok
Empty Results	/air/search?simulate=empty
Error	        /air/search?simulate=error
Partial Results	/air/search?simulate=partial
Slow Response	/air/search?simulate=slow
Static Route	/air/flights/karachi-to-dubai


Features
✅ Server/Client component boundaries with Suspense streaming
✅ URL-driven state (shareable, back/forward navigation)
✅ 1200-2500ms simulated API delay
✅ 4 states: ok, empty, error, partial
✅ PKR currency formatting with Intl.NumberFormat
✅ Timezone-aware time display
✅ Keyboard accessible with visible focus
✅ Focus-trapping mobile filter dialog
✅ 200% zoom unclipped
✅ Static cached routes with revalidation

Technologies
Next.js 14 App Router
TypeScript
Tailwind CSS
React Hooks (useState, useEffect, useCallback, useMemo)


Decisions & Tradeoffs

Server/Client Boundaries
Search page is Server Component with Suspense
FlightResults is Client Component for interactivity (filters, state)
API route handles data fetching with simulated delays

URL as State
All filters are driven by URL params, enabling:
Shareable links
Back/forward navigation
Refresh persistence


Caching Strategy
API responses are uncached (live fares require freshness)
Static routes use revalidate: 3600 (1 hour)

Error Handling
Graceful degradation for all 4 states
Retry mechanism preserves filters
Partial results show banner with failed airlines

Accessibility
ARIA labels on all interactive elements
Live regions for result counts
Keyboard navigation with visible focus rings
Focus trapping in mobile filter dialog
Screen reader friendly (sr-only classes)

What I'd Improve
Add pagination for large result sets
Real-time price tracking with WebSockets
More filter options (departure time, duration)
Unit tests with Jest and React Testing Library
Internationalization (Urdu support)

Performance optimization with React.memo

Time Taken
7 hours

Approach
Built with mobile-first design, accessibility as priority, and graceful error handling for all states. Focused on practical judgment over over-engineering.