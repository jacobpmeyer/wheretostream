# Components Specification Guide

## Overview
This document specifies all the React components needed for the Streaming Availability Finder app, including their props, behavior, and implementation details.

## Component Architecture

```
App Layout
├── Header (Navigation)
├── Page Content
│   ├── Homepage
│   │   ├── SearchBar
│   │   └── Hero Section
│   ├── Search Results
│   │   ├── SearchBar
│   │   ├── ShowCard (multiple)
│   │   └── LoadingSpinner
│   └── Show Details
│       ├── ShowHeader
│       ├── ShowDetails
│       ├── CountrySelector
│       └── StreamingOptions
│           └── StreamingOptionCard (multiple)
└── Footer
```

---

## Core Components

### 1. SearchBar Component
**File:** `src/components/SearchBar.tsx`

**Purpose:** 
Main search input that allows users to search for movies and TV shows.

**Props:**
```typescript
interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}
```

**Behavior:**
- Debounce input (300ms delay)
- Show loading indicator while searching
- Clear button when input has text
- Submit on Enter key
- Minimum 2 characters to search
- Navigate to `/search?q={query}` on submit

**Implementation:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar({ 
  defaultValue = '', 
  placeholder = 'Search for movies and TV shows...',
  autoFocus = false,
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery && onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-12 py-4 text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
}
```

**Styling Notes:**
- Rounded, prominent design
- Icon inside input (left side)
- Clear button (right side) when text present
- Smooth focus state transition
- Mobile responsive (full width on mobile)

---

### 2. ShowCard Component
**File:** `src/components/ShowCard.tsx`

**Purpose:**
Display a show preview card in search results.

**Props:**
```typescript
interface ShowCardProps {
  show: {
    id: string;
    title: string;
    showType: 'movie' | 'series';
    firstAirYear: number;
    lastAirYear?: number;
    posterUrl?: string;
    rating?: number;
    genres?: Array<{ name: string }>;
  };
  country?: string;
}
```

**Behavior:**
- Click navigates to `/show/[id]?country={country}`
- Hover effect (lift up, shadow increase)
- Lazy load poster image
- Show "Movie" or "Series" badge
- Display rating if available
- Show year range for series

**Implementation:**
```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Film, Tv } from 'lucide-react';

export default function ShowCard({ show, country = 'us' }: ShowCardProps) {
  const year = show.lastAirYear 
    ? `${show.firstAirYear}-${show.lastAirYear}`
    : show.firstAirYear;

  return (
    <Link 
      href={`/show/${show.id}?country=${country}`}
      className="group block transition-transform hover:-translate-y-1"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gray-200">
          {show.posterUrl ? (
            <Image
              src={show.posterUrl}
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
          <h3 className="font-bold text-lg line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {show.title}
          </h3>
          <p className="text-sm text-gray-600">{year}</p>
          {show.genres && show.genres.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-1">
              {show.genres.map(g => g.name).join(', ')}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
```

**Styling Notes:**
- Card with subtle shadow
- 2:3 aspect ratio for poster
- Hover lift effect
- Badge overlays for type and rating
- Line clamp for long titles

---

### 3. CountrySelector Component
**File:** `src/components/CountrySelector.tsx`

**Purpose:**
Dropdown to select viewing country for streaming availability.

**Props:**
```typescript
interface CountrySelectorProps {
  value: string;
  onChange: (country: string) => void;
  countries: Array<{ code: string; name: string; flag: string }>;
}
```

**Behavior:**
- Displays current country with flag
- Opens dropdown on click
- Search/filter countries in dropdown
- Updates URL param when changed
- Closes on selection or outside click

**Implementation:**
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CountrySelector({ 
  value, 
  onChange, 
  countries 
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(c => c.code === value);
  
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
      >
        <span className="text-2xl">{selectedCountry?.flag}</span>
        <span className="font-medium">{selectedCountry?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-80">
            {filteredCountries.map(country => (
              <button
                key={country.code}
                onClick={() => handleSelect(country.code)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="text-2xl">{country.flag}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 4. StreamingOptions Component
**File:** `src/components/StreamingOptions.tsx`

**Purpose:**
Display all streaming options for a show, grouped by type.

**Props:**
```typescript
interface StreamingOptionsProps {
  options: StreamingOption[];
  showTitle: string;
}

interface StreamingOption {
  service: Service;
  type: 'subscription' | 'free' | 'buy' | 'rent' | 'addon';
  quality: 'sd' | 'hd' | 'uhd' | 'qhd';
  link: string;
  videoLink?: string;
  price?: Price;
  addon?: Service;
  audios: Audio[];
  subtitles: Subtitle[];
}
```

**Behavior:**
- Group options by type (subscription, free, rent, buy)
- Sort by quality within each group
- Display service logo
- Show quality badge
- "Watch Now" button with deep link
- Show price for rent/buy options
- Expandable details (audio/subtitles)

**Implementation:**
```typescript
import StreamingOptionCard from './StreamingOptionCard';

export default function StreamingOptions({ 
  options, 
  showTitle 
}: StreamingOptionsProps) {
  const grouped = groupByType(options);

  return (
    <div className="space-y-8">
      {grouped.subscription.length > 0 && (
        <Section title="Stream" icon="📺" options={grouped.subscription} />
      )}
      
      {grouped.free.length > 0 && (
        <Section title="Watch Free" icon="🆓" options={grouped.free} />
      )}
      
      {grouped.rent.length > 0 && (
        <Section title="Rent" icon="💳" options={grouped.rent} />
      )}
      
      {grouped.buy.length > 0 && (
        <Section title="Buy" icon="🛒" options={grouped.buy} />
      )}

      {options.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Not currently available to stream in this country.</p>
          <p className="text-sm mt-2">Try selecting a different country.</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon, options }: SectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
        <span className="text-sm font-normal text-gray-500">
          ({options.length})
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, idx) => (
          <StreamingOptionCard key={idx} option={option} />
        ))}
      </div>
    </div>
  );
}

function groupByType(options: StreamingOption[]) {
  return {
    subscription: options.filter(o => o.type === 'subscription' || o.type === 'addon'),
    free: options.filter(o => o.type === 'free'),
    rent: options.filter(o => o.type === 'rent'),
    buy: options.filter(o => o.type === 'buy'),
  };
}
```

---

### 5. StreamingOptionCard Component
**File:** `src/components/StreamingOptionCard.tsx`

**Purpose:**
Individual card for a single streaming option.

**Props:**
```typescript
interface StreamingOptionCardProps {
  option: StreamingOption;
}
```

**Implementation:**
```typescript
import Image from 'next/image';
import { ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';

export default function StreamingOptionCard({ option }: StreamingOptionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

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
            <p className="font-semibold">{option.service.name}</p>
            {option.addon && (
              <p className="text-xs text-gray-600">via {option.addon.name}</p>
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
        className="mt-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
      >
        <Info className="h-4 w-4" />
        {showDetails ? 'Hide' : 'Show'} details
      </button>

      {showDetails && (
        <div className="mt-3 pt-3 border-t text-sm text-gray-600 space-y-1">
          <p><strong>Audio:</strong> {formatAudios(option.audios)}</p>
          <p><strong>Subtitles:</strong> {formatSubtitles(option.subtitles)}</p>
        </div>
      )}
    </div>
  );
}

function QualityBadge({ quality }: { quality: string }) {
  const colors = {
    sd: 'bg-gray-500',
    hd: 'bg-blue-500',
    uhd: 'bg-purple-500',
    qhd: 'bg-pink-500',
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold text-white rounded ${colors[quality] || colors.hd}`}>
      {quality.toUpperCase()}
    </span>
  );
}
```

---

### 6. LoadingSpinner Component
**File:** `src/components/LoadingSpinner.tsx`

**Purpose:**
Simple loading indicator.

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}
```

**Implementation:**
```typescript
export default function LoadingSpinner({ 
  size = 'md', 
  message 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizeClasses[size]} border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
}
```

---

### 7. ShowDetails Component
**File:** `src/components/ShowDetails.tsx`

**Purpose:**
Display full show information including poster, overview, cast, etc.

**Props:**
```typescript
interface ShowDetailsProps {
  show: Show;
}
```

**Implementation:**
```typescript
import Image from 'next/image';
import { Star, Calendar } from 'lucide-react';

export default function ShowDetails({ show }: ShowDetailsProps) {
  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-8">
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
        <Image
          src={show.posterUrl}
          alt={show.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Details */}
      <div>
        <div className="mb-4">
          <h1 className="text-4xl font-bold mb-2">{show.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {show.firstAirYear}
              {show.lastAirYear && ` - ${show.lastAirYear}`}
            </span>
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
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p className="text-gray-700 leading-relaxed">{show.overview}</p>
          </div>
        )}

        {show.cast && show.cast.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cast</h3>
            <p className="text-gray-700">{show.cast.slice(0, 5).join(', ')}</p>
          </div>
        )}

        {show.directors && show.directors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Director</h3>
            <p className="text-gray-700">{show.directors.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Utility Components

### 8. ErrorMessage Component
```typescript
export function ErrorMessage({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600 text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

### 9. EmptyState Component
```typescript
export function EmptyState({ 
  message, 
  icon 
}: { 
  message: string; 
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 text-gray-500">
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-lg">{message}</p>
    </div>
  );
}
```

---

## Custom Hooks

### useDebounce Hook
**File:** `src/hooks/useDebounce.ts`

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Component Testing Checklist

For each component, verify:
- [ ] Props are correctly typed
- [ ] Loading states are handled
- [ ] Error states are handled
- [ ] Hover states work
- [ ] Click handlers work
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Images use Next.js Image component
- [ ] Links use Next.js Link component
- [ ] No console errors or warnings

## Common Patterns

### Client vs Server Components
- **'use client'**: SearchBar, CountrySelector, Interactive components
- **Server**: ShowCard, ShowDetails, StreamingOptions (when possible)

### Data Fetching
- Server components: Use async/await directly
- Client components: Use React Query or SWR

### Styling
- Use Tailwind utility classes
- Create custom components for repeated patterns
- Use `cn()` utility for conditional classes
