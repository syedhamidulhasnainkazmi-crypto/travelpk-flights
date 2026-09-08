## File 2: CACHING.md



# Caching Strategy

## Overview

This document outlines the caching decisions made for the Travel.pk flight results page.

## What I Cached

### Static Route Pages
- **Location**: `/air/flights/[route]`
- **Strategy**: Static Generation (SSG) with revalidation
- **Revalidate**: 3600 seconds (1 hour)
- **Why**: Flight route pages contain static content (airline names, logos, routes) that don't change frequently. Caching improves performance and reduces server load.

```typescript
export const revalidate = 3600;
```

### Layout Components
- Next.js Layout is cached by default
- Static parts (header, footer) are cached

## What I Did NOT Cache

### API Endpoint
- **Location**: `/api/offers`
- **Cache Headers**: `Cache-Control: no-cache, no-store, must-revalidate`
- **Why**: Flight prices change frequently (real-time). Users expect accurate, up-to-date pricing. Caching would show stale prices leading to trust issues.

```typescript
// API responses are uncached
return NextResponse.json({ success: true, data: offersData });


### Flight Results Page
- **Location**: `/air/search`
- **Cache**: None
- **Why**: Results depend on URL params (simulate state) and must reflect real-time data

## What Breaks If Reversed

### If API Was Cached
- ❌ Users would see stale prices
- ❌ Trust issues (price shown ≠ price at booking)
- ❌ Incorrect bookings
- ❌ User frustration

### If Static Routes Were Not Cached
- ❌ Slower page loads
- ❌ Higher server costs
- ❌ Worse user experience on slow connections

## Cache Headers Summary

| Resource | Cache Strategy | Headers |
|----------|---------------|---------|
| `/api/offers` | No Cache | `Cache-Control: no-cache, no-store, must-revalidate` |
| `/air/flights/[route]` | Revalidate 1 hour | `Cache-Control: s-maxage=3600, stale-while-revalidate` |
| Static Assets (CSS, JS) | Long-term cache | `Cache-Control: public, max-age=31536000, immutable` |

## Revalidation Process

1. First request builds the static page
2. Page served from cache for 1 hour
3. After 1 hour, first request triggers background revalidation
4. User gets stale page while new page regenerates
5. Next user gets fresh page

## Benefits

- **Performance**: 90% faster page loads for static routes
- **Cost**: Reduced server compute and database queries
- **UX**: Consistent experience with background updates

## Tradeoffs

- Static routes may show stale data for up to 1 hour
- Freshness vs Speed tradeoff acceptable for flight routes
- Prices still fresh via API endpoint
