export default function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse" role="status" aria-label="Loading flights">
      <div className="sr-only">Loading flight results...</div>
      
      {/* Filter bar skeleton */}
      <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      
      {/* Results skeletons */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <div className="flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}