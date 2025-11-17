import Link from 'next/link';
import Image from 'next/image';
import { Film, Tv } from 'lucide-react';

interface ShowCardProps {
  show: {
    id: string;
    title: string;
    showType: 'movie' | 'series';
    firstAirYear?: number;
    lastAirYear?: number;
    posterUrl?: string;
    rating?: number;
    genres?: Array<{ name: string }>;
  };
  country?: string;
}

export default function ShowCard({ show, country = 'us' }: ShowCardProps) {
  const year = show.firstAirYear
    ? show.lastAirYear
      ? `${show.firstAirYear}-${show.lastAirYear}`
      : show.firstAirYear
    : 'N/A';

  // Get poster URL from imageSet if available
  const posterUrl = (show as any).imageSet?.verticalPoster?.w480 || show.posterUrl;

  return (
    <Link
      href={`/show/${show.id}?country=${country}`}
      className="group block transition-transform hover:-translate-y-1"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gray-200">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={show.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              {show.showType === 'movie' ? (
                <Film className="h-16 w-16 text-gray-400" />
              ) : (
                <Tv className="h-16 w-16 text-gray-400" />
              )}
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded">
              {show.showType === 'movie' ? 'Movie' : 'Series'}
            </span>
          </div>

          {/* Rating */}
          {show.rating && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 text-sm font-bold bg-yellow-400 text-black rounded">
                {show.rating}/100
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 mb-1 text-black group-hover:text-blue-600 transition-colors">
            {show.title}
          </h3>
          <p className="text-sm text-gray-700">{year}</p>
          {show.genres && show.genres.length > 0 && (
            <p className="text-xs text-gray-700 mt-2 line-clamp-1">
              {show.genres.map(g => g.name).join(', ')}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
