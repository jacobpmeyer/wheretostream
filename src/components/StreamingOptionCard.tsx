'use client';

import Image from 'next/image';
import { ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';
import { StreamingOption } from '@/lib/types';

interface StreamingOptionCardProps {
  option: StreamingOption;
}

function QualityBadge({ quality }: { quality?: string }) {
  if (!quality) return null;

  const colors = {
    sd: 'bg-gray-500',
    hd: 'bg-blue-500',
    uhd: 'bg-purple-500',
    qhd: 'bg-pink-500',
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold text-white rounded ${colors[quality as keyof typeof colors] || colors.hd}`}>
      {quality.toUpperCase()}
    </span>
  );
}

function formatAudios(audios?: Array<{ language: string; region?: string }>): string {
  if (!audios || audios.length === 0) return 'None';
  return audios.map(a => a.language.toUpperCase()).join(', ');
}

function formatSubtitles(subtitles?: Array<{ language: string; region?: string; closedCaptions: boolean }>): string {
  if (!subtitles || subtitles.length === 0) return 'None';
  return subtitles.map(s => s.language.toUpperCase()).join(', ');
}

export default function StreamingOptionCard({ option }: StreamingOptionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Check for English and Japanese subtitles
  const hasEnglishSubs = option.subtitles?.some(sub => {
    const lang = (sub as any).locale?.language?.toLowerCase() || sub.language?.toLowerCase();
    return lang === 'en' || lang === 'eng';
  });
  const hasJapaneseSubs = option.subtitles?.some(sub => {
    const lang = (sub as any).locale?.language?.toLowerCase() || sub.language?.toLowerCase();
    return lang === 'ja' || lang === 'jpn';
  });

  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={option.service.imageSet.darkThemeImage}
            alt={option.service.name}
            width={48}
            height={48}
            className="rounded"
          />
          <div>
            <p className="font-semibold text-black">{option.service.name}</p>
            {option.addon && (
              <p className="text-xs text-gray-700">via {option.addon.name}</p>
            )}
          </div>
        </div>
        <QualityBadge quality={option.quality} />
      </div>

      {option.price && (
        <p className="text-lg font-bold text-blue-600 mb-3">
          {option.price.formatted}
        </p>
      )}

      {/* Subtitle availability badges */}
      <div className="flex gap-2 mb-3">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-700">English Subs:</span>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
            hasEnglishSubs ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {hasEnglishSubs ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-700">Japanese Subs:</span>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
            hasJapaneseSubs ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {hasJapaneseSubs ? '✓ Yes' : '✗ No'}
          </span>
        </div>
      </div>

      <a
        href={option.videoLink || option.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <span className="flex items-center justify-center gap-2">
          Watch Now
          <ExternalLink className="h-4 w-4" />
        </span>
      </a>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-sm text-gray-700 hover:text-black flex items-center gap-1"
      >
        <Info className="h-4 w-4" />
        {showDetails ? 'Hide' : 'Show'} details
      </button>

      {showDetails && (
        <div className="mt-3 pt-3 border-t text-sm text-gray-800 space-y-1">
          <p><strong>Audio:</strong> {formatAudios(option.audios)}</p>
          <p><strong>Subtitles:</strong> {formatSubtitles(option.subtitles)}</p>
        </div>
      )}
    </div>
  );
}
