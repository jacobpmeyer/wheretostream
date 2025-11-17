import { searchShows } from '@/lib/streaming-api';
import ShowCard from '@/components/ShowCard';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    country?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const country = params.country || 'us';

  // Handle empty query
  if (!query || query.trim().length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-xl text-gray-800">
              Enter a search query to find movies and TV shows
            </p>
          </div>
        </div>
      </div>
    );
  }

  let results;
  let error;

  try {
    results = await searchShows(query, country);
  } catch (e) {
    error = e instanceof Error ? e.message : 'An error occurred while searching';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Results */}
        {error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <p className="text-gray-800">Please try again or search for something else.</p>
          </div>
        ) : results && results.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black">
                Found {results.length} {results.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.map((show) => (
                <ShowCard key={show.id} show={show as any} country={country} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-black mb-2">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-gray-700">
              Try a different search term or check your spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
