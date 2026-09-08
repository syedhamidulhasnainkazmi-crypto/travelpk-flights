// Format price in PKR
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format time with timezone offset
export function formatTimeWithOffset(dateString: string): string {
  const date = new Date(dateString);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date);
  
  // Extract timezone offset from the date string
  const match = dateString.match(/([+-]\d{2}:\d{2})$/);
  const offset = match ? match[1] : '';
  
  return time + ' ' + offset;
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Get stops text
export function getStopsText(stops: number): string {
  if (stops === 0) return 'Direct';
  if (stops === 1) return '1 Stop';
  return `${stops} Stops`;
}

// Get duration in hours and minutes
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}