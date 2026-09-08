import { NextResponse } from 'next/server';
import offersData from '@/data/offers.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const simulate = searchParams.get('simulate') || 'ok';

  // Simulate delay: 1200-2500ms
  const delay = Math.floor(Math.random() * 1300) + 1200;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Handle simulate states
  switch (simulate) {
    case 'error':
      return new NextResponse(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    case 'empty':
      return NextResponse.json({ 
        success: true, 
        data: [], 
        message: 'No flights found matching your criteria' 
      });

    case 'partial':
      // Return 7 out of 10 offers (simulate some airlines failed)
      const partialData = offersData.slice(0, 7);
      return NextResponse.json({ 
        success: true, 
        data: partialData,
        partial: true,
        failedAirlines: ['Airblue', 'Flydubai'],
        message: 'Some airlines could not be loaded'
      });

    case 'slow':
      // Extra delay for slow response
      await new Promise(resolve => setTimeout(resolve, 3000));
      return NextResponse.json({ success: true, data: offersData });

    case 'ok':
    default:
      return NextResponse.json({ success: true, data: offersData });
  }
}