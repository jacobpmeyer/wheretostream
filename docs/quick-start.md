# Quick Start Implementation Guide

## Overview
This guide provides step-by-step instructions for building the Streaming Availability Finder app. Follow these phases in order for the most efficient development workflow.

---

## Phase 0: Project Setup (30 minutes)

### Step 1: Initialize Next.js Project
```bash
# Create new Next.js app
npx create-next-app@latest streaming-finder

# Select these options:
# ✓ TypeScript
# ✓ ESLint
# ✓ Tailwind CSS
# ✓ src/ directory
# ✓ App Router
# ✓ Turbopack
# ✗ Customize default import alias (use @/*)

cd streaming-finder
```

### Step 2: Install Dependencies
```bash
# Install Movie of the Night SDK
npm install streaming-availability

# Install icon library
npm install lucide-react

# Install utility libraries
npm install clsx tailwind-merge

# Optional: Install React Query for data fetching
npm install @tanstack/react-query
```

### Step 3: Set Up Mise
```bash
# Initialize Mise with Node 22
mise use node@22

# This creates .mise.toml - customize it with tasks
```

Create `.mise.toml`:
```toml
[tools]
node = "22"

[env]
NODE_ENV = "development"

[tasks.dev]
description = "Start development server"
run = "npm run dev"

[tasks.build]
description = "Build for production"
run = "npm run build"

[tasks.lint]
description = "Run ESLint"
run = "npm run lint"

[tasks.setup]
description = "Install dependencies"
run = "npm install"
```

### Step 4: Configure Environment
```bash
# Create .env.local
touch .env.local
```

Add to `.env.local`:
```env
RAPIDAPI_KEY=your_api_key_here_from_rapidapi_dashboard
```

### Step 5: Get API Key
1. Go to: https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability
2. Sign up (free, no credit card)
3. Subscribe to Basic (Free) plan
4. Copy your API key
5. Paste into `.env.local`

### Step 6: Update .gitignore
Ensure these are in `.gitignore`:
```
.env.local
.env*.local
.mise.local.toml
```

---

## Phase 1: Core Infrastructure (1 hour)

### Step 1: Set Up Project Structure
```bash
mkdir -p src/lib
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/app/search
mkdir -p src/app/show/[id]
```

### Step 2: Create Type Definitions
Create `src/lib/types.ts`:
```typescript
export interface Show {
  id: string;
  title: string;
  showType: 'movie' | 'series';
  firstAirYear: number;
  lastAirYear?: number;
  posterUrl?: string;
  backdropUrl?: string;
  overview?: string;
  rating?: number;
  genres?: Array<{ id: string; name: string }>;
  cast?: string[];
  directors?: string[];
  creators?: string[];
  imdbId?: string;
  tmdbId?: string;
  streamingOptions?: {
    [country: string]: StreamingOption[];
  };
}

export interface StreamingOption {
  service: Service;
  type: 'subscription' | 'free' | 'buy' | 'rent' | 'addon';
  quality: 'sd' | 'hd' | 'uhd' | 'qhd';
  link: string;
  videoLink?: string;
  price?: {
    amount: number;
    currency: string;
    formatted: string;
  };
  addon?: Service;
  audios: Array<{ language: string; region?: string }>;
  subtitles: Array<{
    language: string;
    region?: string;
    closedCaptions: boolean;
  }>;
  expiresOn?: number;
}

export interface Service {
  id: string;
  name: string;
  homeUrl: string;
  imageSet: {
    lightThemeImage: string;
    darkThemeImage: string;
  };
}
```

### Step 3: Create API Client
Create `src/lib/streaming-api.ts`:
```typescript
import { Client, Configuration } from 'streaming-availability';

if (!process.env.RAPIDAPI_KEY) {
  throw new Error('RAPIDAPI_KEY environment variable is not set');
}

const client = new Client(
  new Configuration({
    apiKey: process.env.RAPIDAPI_KEY
  })
);

export async function searchShows(title: string, country: string = 'us') {
  try {
    const response = await client.showsApi.searchShowsByTitle({
      title,
      country,
      outputLanguage: 'en'
    });
    return response;
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
}

export async function getShowById(id: string, country: string = 'us') {
  try {
    const response = await client.showsApi.getShow({
      id,
      country,
      outputLanguage: 'en'
    });
    return response;
  } catch (error) {
    console.error('Error fetching show:', error);
    throw error;
  }
}

export { client };
```

### Step 4: Create Utility Functions
Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(firstYear: number, lastYear?: number): string {
  return lastYear ? `${firstYear}-${lastYear}` : `${firstYear}`;
}
```

### Step 5: Create Countries Data
Create `src/lib/countries.ts`:
```typescript
export const COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
  // Add more as needed
];
```

### Step 6: Test API Connection
Install tsx for running TypeScript:
```bash
npm install -D tsx
```

Create `scripts/test-api.ts`:
```typescript
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually load .env.local (Next.js does this automatically)
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('Error loading .env.local:', error);
}

async function testAPI() {
  // Dynamic import AFTER env is loaded
  const { searchShows, getShowById } = await import('../src/lib/streaming-api.js');

  console.log('Testing API connection...\n');

  if (!process.env.RAPIDAPI_KEY) {
    console.error('❌ RAPIDAPI_KEY is not set in .env.local');
    process.exit(1);
  }

  console.log('✓ RAPIDAPI_KEY is set\n');

  try {
    // Test search
    console.log('1. Testing search for "Inception"...');
    const results = await searchShows('Inception', 'us');
    console.log(`   ✓ Found ${results.length} results`);

    if (results.length > 0) {
      console.log(`   ✓ First result: ${results[0].title}`);

      // Test get show by ID
      console.log('\n2. Testing get show details...');
      const show = await getShowById(results[0].id, 'us');
      console.log(`   ✓ Fetched details for: ${show.title}`);
      console.log(`   ✓ Overview: ${show.overview?.substring(0, 100)}...`);

      if (show.streamingOptions && show.streamingOptions['us']) {
        console.log(`   ✓ Found ${show.streamingOptions['us'].length} streaming options in US`);
      }
    }

    console.log('\n✅ API connection successful!');
    console.log('All tests passed. You\'re ready to build the app!\n');
  } catch (error) {
    console.error('\n❌ API test failed:');
    console.error(error);
    console.log('\nPlease check:');
    console.log('1. Your RAPIDAPI_KEY is set in .env.local');
    console.log('2. You have subscribed to the API on RapidAPI');
    console.log('3. You have not exceeded your rate limit\n');
    process.exit(1);
  }
}

testAPI();
```

Run the test:
```bash
npx tsx scripts/test-api.ts
```

You should see:
```
✓ RAPIDAPI_KEY is set
✓ Found 20 results
✓ First result: Inception
✓ Fetched details for: Inception
✓ Found 5 streaming options in US
✅ API connection successful!
```

---

## Phase 2: Build Components (2-3 hours)

### Step 1: Create useDebounce Hook
Create `src/hooks/useDebounce.ts`:
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

### Step 2: Build SearchBar Component
Create `src/components/SearchBar.tsx` - see components-guide.md for full implementation

### Step 3: Build LoadingSpinner Component
Create `src/components/LoadingSpinner.tsx` - see components-guide.md

### Step 4: Build ShowCard Component
Create `src/components/ShowCard.tsx` - see components-guide.md

### Step 5: Build CountrySelector Component
Create `src/components/CountrySelector.tsx` - see components-guide.md

### Step 6: Build ShowDetails Component
Create `src/components/ShowDetails.tsx` - see components-guide.md

### Step 7: Build StreamingOptions Component
Create `src/components/StreamingOptions.tsx` - see components-guide.md

### Step 8: Build StreamingOptionCard Component
Create `src/components/StreamingOptionCard.tsx` - see components-guide.md

---

## Phase 3: Build Pages (2-3 hours)

### Step 1: Update Root Layout
Update `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Streaming Finder - Where to Watch Movies & TV Shows',
  description: 'Find where to watch your favorite movies and TV shows across streaming services worldwide.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-600">
              Streaming Finder
            </h1>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="border-t bg-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Powered by Movie of the Night API</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

### Step 2: Build Homepage
Update `src/app/page.tsx`:
```typescript
import SearchBar from '@/components/SearchBar';
import { Film } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <Film className="h-20 w-20 mx-auto mb-6 text-blue-600" />
        <h1 className="text-5xl font-bold mb-4">
          Find Where to Watch
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Search for any movie or TV show and discover where you can stream it
        </p>
        <SearchBar autoFocus />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">🌍 60+ Countries</h3>
            <p className="text-gray-600">Check availability across the globe</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">📺 All Services</h3>
            <p className="text-gray-600">Netflix, Disney+, Prime Video & more</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">🔗 Direct Links</h3>
            <p className="text-gray-600">Click to watch immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Build Search Results Page
Create `src/app/search/page.tsx`:
```typescript
import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import ShowCard from '@/components/ShowCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { searchShows } from '@/lib/streaming-api';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; country?: string };
}) {
  const query = searchParams.q || '';
  const country = searchParams.country || 'us';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      <Suspense fallback={<LoadingSpinner message="Searching..." />}>
        <SearchResults query={query} country={country} />
      </Suspense>
    </div>
  );
}

async function SearchResults({
  query,
  country,
}: {
  query: string;
  country: string;
}) {
  if (!query || query.length < 2) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Enter at least 2 characters to search</p>
      </div>
    );
  }

  try {
    const results = await searchShows(query, country);

    if (results.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No results found for "{query}"</p>
          <p className="text-sm mt-2">Try a different search term</p>
        </div>
      );
    }

    return (
      <>
        <h2 className="text-2xl font-bold mb-6">
          Found {results.length} results for "{query}"
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map((show) => (
            <ShowCard key={show.id} show={show} country={country} />
          ))}
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-lg">Error loading results</p>
        <p className="text-sm mt-2">Please try again</p>
      </div>
    );
  }
}
```

### Step 4: Build Show Detail Page
Create `src/app/show/[id]/page.tsx`:
```typescript
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ShowDetails from '@/components/ShowDetails';
import CountrySelector from '@/components/CountrySelector';
import StreamingOptions from '@/components/StreamingOptions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getShowById } from '@/lib/streaming-api';
import { COUNTRIES } from '@/lib/countries';

export default async function ShowPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { country?: string };
}) {
  const country = searchParams.country || 'us';

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner message="Loading show details..." />}>
        <ShowContent showId={params.id} country={country} />
      </Suspense>
    </div>
  );
}

async function ShowContent({ 
  showId, 
  country 
}: { 
  showId: string; 
  country: string;
}) {
  try {
    const show = await getShowById(showId, country);

    if (!show) {
      notFound();
    }

    const streamingOptions = show.streamingOptions?.[country] || [];

    return (
      <>
        <ShowDetails show={show} />

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Where to Watch</h2>
            <CountrySelector
              value={country}
              onChange={(newCountry) => {
                // Update URL with new country
                window.location.href = `/show/${showId}?country=${newCountry}`;
              }}
              countries={COUNTRIES}
            />
          </div>

          <StreamingOptions 
            options={streamingOptions} 
            showTitle={show.title}
          />
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-lg">Error loading show details</p>
        <p className="text-sm mt-2">Please try again</p>
      </div>
    );
  }
}
```

---

## Phase 4: Styling & Polish (1-2 hours)

### Step 1: Update Tailwind Config
Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 2: Update Global Styles
Update `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer utilities {
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
```

---

## Phase 5: Testing & Optimization (1-2 hours)

### Step 1: Test All Features
- [ ] Search works with various queries
- [ ] Results display correctly
- [ ] Detail page loads properly
- [ ] Country selector works
- [ ] Deep links navigate correctly
- [ ] Mobile responsive
- [ ] No console errors

### Step 2: Add Loading States
Ensure all async operations show loading states

### Step 3: Add Error Boundaries
Handle API errors gracefully

### Step 4: Optimize Images
Ensure all images use Next.js Image component

### Step 5: Check Accessibility
- Test keyboard navigation
- Verify color contrast
- Add ARIA labels where needed

---

## Phase 6: Deployment (30 minutes)

### Step 1: Build Locally
```bash
npm run build
npm start
```

Test the production build thoroughly.

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to connect to Vercel
```

### Step 3: Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add `RAPIDAPI_KEY`

### Step 4: Test Production Site
- Verify all features work
- Test on multiple devices
- Check Lighthouse scores

---

## Troubleshooting Common Issues

### Issue: API calls not working
- **Check**: RAPIDAPI_KEY in `.env.local`
- **Check**: API key is valid on RapidAPI dashboard
- **Check**: Not exceeding 100 requests/day

### Issue: Images not loading
- **Check**: Using Next.js Image component
- **Check**: Image domains configured in `next.config.js`
- **Check**: Poster URLs are valid

### Issue: Build fails
- **Check**: No TypeScript errors (`npm run build`)
- **Check**: All dependencies installed
- **Check**: Node version is 18+

### Issue: Styles not applying
- **Check**: Tailwind is configured correctly
- **Check**: Component uses correct class names
- **Check**: No CSS conflicts

---

## Performance Checklist

- [ ] Images optimized with Next.js Image
- [ ] API responses cached appropriately
- [ ] Lazy loading implemented
- [ ] Bundle size is reasonable
- [ ] No unnecessary re-renders
- [ ] Lighthouse score > 90

---

## Final Checklist

- [ ] All features working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessible
- [ ] Fast loading times
- [ ] SEO optimized
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] README updated
- [ ] Code documented

---

## Next Steps

After MVP is complete:
1. Gather user feedback
2. Monitor API usage
3. Fix any bugs
4. Plan Phase 2 features
5. Consider upgrading API plan if needed

---

## Time Estimates

- **Phase 0** (Setup): 30 minutes
- **Phase 1** (Infrastructure): 1 hour
- **Phase 2** (Components): 2-3 hours
- **Phase 3** (Pages): 2-3 hours
- **Phase 4** (Polish): 1-2 hours
- **Phase 5** (Testing): 1-2 hours
- **Phase 6** (Deployment): 30 minutes

**Total Estimated Time: 8-13 hours**

For an experienced developer, this could be completed in 1-2 days of focused work.
