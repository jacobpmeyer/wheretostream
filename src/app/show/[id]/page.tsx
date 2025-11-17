import { getShowById } from '@/lib/streaming-api';
import ShowDetails from '@/components/ShowDetails';
import StreamingOptions from '@/components/StreamingOptions';
import CountrySelectorWithNav from '@/components/CountrySelectorWithNav';
import { notFound } from 'next/navigation';
import { COUNTRIES } from '@/lib/countries';

interface ShowPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    country?: string;
  }>;
}

export default async function ShowPage({ params, searchParams }: ShowPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const showId = resolvedParams.id;
  const country = resolvedSearchParams.country || 'us';

  let show;
  let error;

  try {
    show = await getShowById(showId, country);
  } catch (e) {
    if (e instanceof Error && e.message.includes('not found')) {
      notFound();
    }
    error = e instanceof Error ? e.message : 'An error occurred while fetching show details';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <p className="text-gray-800">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    notFound();
  }

  const streamingOptions = show.streamingOptions?.[country] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Show Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <ShowDetails show={show as any} />
        </div>

        {/* Streaming Options */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-black">Where to Watch</h2>
            <CountrySelectorWithNav
              currentCountry={country}
              showId={showId}
            />
          </div>
          <StreamingOptions options={streamingOptions as any} />
        </div>
      </div>
    </div>
  );
}
