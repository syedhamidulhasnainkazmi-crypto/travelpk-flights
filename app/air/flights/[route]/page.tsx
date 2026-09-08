import offersData from '@/data/offers.json';

// This page is statically cached with revalidation
export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{
    route: string;
  }>;
}

// Format price in PKR
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format time with timezone offset
function formatTimeWithOffset(dateString: string): string {
  const date = new Date(dateString);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date);
  
  const match = dateString.match(/([+-]\d{2}:\d{2})$/);
  const offset = match ? match[1] : '';
  
  return time + ' ' + offset;
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Get stops text
function getStopsText(stops: number): string {
  if (stops === 0) return 'Direct';
  if (stops === 1) return '1 Stop';
  return `${stops} Stops`;
}

// Define Flight type
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

export default async function FlightRoutePage({ params }: PageProps) {
  // Await the params Promise
  const { route } = await params;
  
  // Decode the route parameter (e.g., "karachi-to-dubai" -> "Karachi to Dubai")
  const routeParts = route.split('-to-');
  const origin = routeParts[0]?.replace(/-/g, ' ') || '';
  const destination = routeParts[1]?.replace(/-/g, ' ') || '';

  // Filter flights for this route
  const flights: Flight[] = offersData.filter(
    (f: Flight) => f.origin.toLowerCase() === origin.toLowerCase() &&
         f.destination.toLowerCase() === destination.toLowerCase()
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">
        Flights from {origin} to {destination}
      </h1>
      <p className="text-gray-600 mb-6">
        {flights.length} flights found
      </p>

      {flights.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No flights found for this route</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map((flight: Flight) => (
            <div key={flight.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {flight.airlineLogo}
                  </div>
                  <div>
                    <h3 className="font-semibold">{flight.airline}</h3>
                    <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(flight.price)}
                  </span>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(flight.departureTime)}</p>
                  <p className="text-xl font-semibold">
                    {formatTimeWithOffset(flight.departureTime)}
                  </p>
                  <p className="text-sm text-gray-600">{flight.origin}</p>
                </div>

                <div className="text-center">
                  <div className="relative">
                    <div className="border-t-2 border-gray-300"></div>
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-500">
                      {flight.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{getStopsText(flight.stops)}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(flight.arrivalTime)}</p>
                  <p className="text-xl font-semibold">
                    {formatTimeWithOffset(flight.arrivalTime)}
                  </p>
                  <p className="text-sm text-gray-600">{flight.destination}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}