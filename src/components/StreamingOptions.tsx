import StreamingOptionCard from './StreamingOptionCard';
import { StreamingOption } from '@/lib/types';

interface StreamingOptionsProps {
  options: StreamingOption[];
}

function groupByType(options: StreamingOption[]) {
  return {
    subscription: options.filter(o => o.type === 'subscription' || o.type === 'addon'),
    free: options.filter(o => o.type === 'free'),
    rent: options.filter(o => o.type === 'rent'),
    buy: options.filter(o => o.type === 'buy'),
  };
}

export default function StreamingOptions({
  options
}: StreamingOptionsProps) {
  const grouped = groupByType(options);

  // Only show subscription and free options (streaming only)
  const streamingOptions = [...grouped.subscription, ...grouped.free];

  // Deduplicate by service ID only (ignore add-ons)
  // Prefer options without add-ons, then by quality
  const uniqueOptions = streamingOptions.reduce((acc, option) => {
    const key = option.service.id;
    const existing = acc.get(key);

    if (!existing) {
      acc.set(key, option);
    } else {
      // Prefer option without addon
      if (!option.addon && existing.addon) {
        acc.set(key, option);
      }
    }
    return acc;
  }, new Map<string, StreamingOption>());

  const dedupedOptions = Array.from(uniqueOptions.values());

  if (dedupedOptions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-800">
        <p className="text-lg">Not currently available to stream in this country.</p>
        <p className="text-sm mt-2">Try selecting a different country.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streaming options grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dedupedOptions.map((option) => {
          const uniqueKey = `${option.service.id}-${option.addon?.id || 'no-addon'}-${option.quality || 'default'}-${option.link}`;
          return <StreamingOptionCard key={uniqueKey} option={option} />;
        })}
      </div>
    </div>
  );
}
