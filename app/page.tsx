import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
      <h1 className="text-3xl font-bold mb-4">Travel.pk Flight Search</h1>
      <p className="text-gray-600 mb-6">
        Search for flights between Pakistan and international destinations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/air/search?simulate=ok"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
        >
          View Flight Results
        </Link>
        <Link 
          href="/air/flights/karachi-to-dubai"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 inline-block"
        >
          View Karachi to Dubai
        </Link>
      </div>
    </main>
  );
}