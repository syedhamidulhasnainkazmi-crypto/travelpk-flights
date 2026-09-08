import { formatPrice, formatTimeWithOffset, formatDate, getStopsText } from '@/lib/utils';

interface FlightCardProps {
  flight: {
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
  };
}

export default function FlightCard({ flight }: FlightCardProps) {
  return (
    <article 
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
      aria-label={`${flight.airline} flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination}`}
    >
      <div className="flex flex-wrap justify-between items-start gap-4">
        {/* Airline Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
            {flight.airlineLogo}
          </div>
          <div>
            <h3 className="font-semibold">{flight.airline}</h3>
            <p className="text-sm text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(flight.price)}
          </span>
          <p className="text-xs text-gray-500">per person</p>
        </div>
      </div>

      {/* Flight Details */}
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
    </article>
  );
}