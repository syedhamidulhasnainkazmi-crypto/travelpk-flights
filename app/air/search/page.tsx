import { Suspense } from 'react';
import FlightResults from '@/components/FlightResults';
import Skeleton from '@/components/Skeleton';

export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Flight Results</h1>
      
      <Suspense fallback={<Skeleton />}>
        <FlightResults />
      </Suspense>
    </main>
  );
}