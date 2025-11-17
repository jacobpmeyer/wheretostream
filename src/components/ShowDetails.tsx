import Image from 'next/image';
import { Star, Calendar, Film, Tv } from 'lucide-react';
import { Show } from '@/lib/types';

interface ShowDetailsProps {
  show: Show;
}

export default function ShowDetails({ show }: ShowDetailsProps) {
  // Get poster URL from imageSet if available
  const posterUrl = (show as any).imageSet?.verticalPoster?.w480 || show.posterUrl;

  return (
    <div>
      {/* Header with Poster and Title Info */}
      <div className="flex gap-6 mb-8">
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg bg-gray-200 w-[240px] flex-shrink-0">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={show.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              {show.showType === 'movie' ? (
                <Film className="h-24 w-24 text-gray-400" />
              ) : (
                <Tv className="h-24 w-24 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* Title Info and Details */}
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-2 text-black">{show.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-700">
              {show.firstAirYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {show.firstAirYear}
                  {show.lastAirYear && ` - ${show.lastAirYear}`}
                </span>
              )}
              {show.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {show.rating}/100
                </span>
              )}
              <span className="px-2 py-1 bg-gray-200 rounded text-sm font-medium">
                {show.showType === 'movie' ? 'Movie' : 'Series'}
              </span>
            </div>
          </div>

          {show.genres && show.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {show.genres.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {show.overview && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Overview</h3>
              <p className="text-gray-800 leading-relaxed">{show.overview}</p>
            </div>
          )}

          {show.cast && show.cast.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Cast</h3>
              <p className="text-gray-800">{show.cast.slice(0, 5).join(', ')}</p>
            </div>
          )}

          {show.directors && show.directors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-black">Director</h3>
              <p className="text-gray-800">{show.directors.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
