'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  airlines: string[];
  stops: string[];
  minPrice: number;
  maxPrice: number;
}

export default function FilterDialog({ 
  isOpen, 
  onClose, 
  onApply, 
  currentFilters 
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus trapping
  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const airlineOptions = ['Emirates', 'PIA', 'Qatar Airways', 'Turkish Airlines', 'Airblue', 'Flydubai'];
  const stopOptions = ['Direct', '1 Stop', '2+ Stops'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(filters);
    onClose();
  };

  const toggleAirline = (airline: string) => {
    setFilters(prev => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter(a => a !== airline)
        : [...prev.airlines, airline]
    }));
  };

  const toggleStops = (stop: string) => {
    setFilters(prev => ({
      ...prev,
      stops: prev.stops.includes(stop)
        ? prev.stops.filter(s => s !== stop)
        : [...prev.stops, stop]
    }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-dialog-title"
    >
      <div 
        ref={dialogRef}
        className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 id="filter-dialog-title" className="text-xl font-semibold">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Airlines */}
          <fieldset>
            <legend className="font-medium mb-2">Airlines</legend>
            <div className="space-y-2">
              {airlineOptions.map((airline) => (
                <label key={airline} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => toggleAirline(airline)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    ref={airline === airlineOptions[0] ? firstInputRef : undefined}
                  />
                  <span>{airline}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Stops */}
          <fieldset>
            <legend className="font-medium mb-2">Stops</legend>
            <div className="space-y-2">
              {stopOptions.map((stop) => (
                <label key={stop} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes(stop)}
                    onChange={() => toggleStops(stop)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{stop}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Price Range */}
          <div>
            <legend className="font-medium mb-2">Price Range (PKR)</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Min</label>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minPrice: parseInt(e.target.value) || 0
                  }))}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Max</label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    maxPrice: parseInt(e.target.value) || 0
                  }))}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setFilters({ airlines: [], stops: [], minPrice: 0, maxPrice: 0 });
              }}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}