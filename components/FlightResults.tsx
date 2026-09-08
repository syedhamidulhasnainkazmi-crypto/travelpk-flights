'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FlightCard from './FlightCard';
import FilterDialog, { FilterOptions } from './FilterDialog';
import { SlidersHorizontal } from 'lucide-react';

interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  stops: number;
  duration: string;
  flightNumber: string;
}

interface APIResponse {
  success: boolean;
  data: Flight[];
  partial?: boolean;
  failedAirlines?: string[];
  message?: string;
  error?: string;
}

// Separate component that uses useSearchParams
function FlightResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partial, setPartial] = useState(false);
  const [failedAirlines, setFailedAirlines] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    airlines: [],
    stops: [],
    minPrice: 0,
    maxPrice: 0
  });

  // Get simulate param with proper null handling
  const simulate = searchParams?.get('simulate') ?? 'ok';

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPartial(false);

    try {
      const response = await fetch(`/api/offers?simulate=${simulate}`);
      const data: APIResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load flights');
        setFlights([]);
        return;
      }

      if (!data.success) {
        setError(data.message || 'Failed to load flights');
        setFlights([]);
        return;
      }

      setFlights(data.data);
      setPartial(data.partial || false);
      setFailedAirlines(data.failedAirlines || []);

    } catch {
      setError('Network error. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, [simulate]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchFlights();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchFlights]);

  const filteredFlights = useMemo(() => {
    let result = flights;

    if (filters.airlines.length > 0) {
      result = result.filter(f => filters.airlines.includes(f.airline));
    }

    if (filters.stops.length > 0) {
      result = result.filter(f => {
        const stopText = f.stops === 0 ? 'Direct' : f.stops === 1 ? '1 Stop' : '2+ Stops';
        return filters.stops.includes(stopText);
      });
    }

    if (filters.minPrice > 0) {
      result = result.filter(f => f.price >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      result = result.filter(f => f.price <= filters.maxPrice);
    }

    return result;
  }, [flights, filters]);

  const handleRetry = () => {
    fetchFlights();
  };

  const clearFilters = () => {
    setFilters({ airlines: [], stops: [], minPrice: 0, maxPrice: 0 });
    router.push('/air/search?simulate=ok');
  };

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-full mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" role="alert">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Retry loading flights"
        >
          Retry
        </button>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12" role="status">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No flights found</h2>
        <p className="text-gray-500 mb-4">
          No results match your current filters.
        </p>
        <button
          onClick={clearFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      </div>
    );
  }

  const activeFilterCount = 
    filters.airlines.length + 
    filters.stops.length + 
    (filters.minPrice > 0 ? 1 : 0) + 
    (filters.maxPrice > 0 ? 1 : 0);

  return (
    <div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {filteredFlights.length} flights found
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredFlights.length}</span> flights
          {activeFilterCount > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
          )}
        </p>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {partial && (
        <div 
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
          role="alert"
        >
          <p className="text-yellow-800">
            ⚠️ Partial results: {failedAirlines.join(', ')} could not be loaded.
          </p>
        </div>
      )}

      {filteredFlights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No flights match your filters</p>
          <button
            onClick={() => setFilters({ airlines: [], stops: [], minPrice: 0, maxPrice: 0 })}
            className="mt-2 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4" role="list">
          {filteredFlights.map((flight) => (
            <div key={flight.id} role="listitem">
              <FlightCard flight={flight} />
            </div>
          ))}
        </div>
      )}

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={applyFilters}
        currentFilters={filters}
      />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function FlightResults() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading flights...</div>}>
      <FlightResultsContent />
    </Suspense>
  );
}