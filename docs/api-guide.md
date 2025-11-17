# Streaming Availability API Integration Guide

## Overview
This document provides detailed information about integrating the Movie of the Night Streaming Availability API into the Next.js application.

## SDK Installation
```bash
npm install streaming-availability
```

## Authentication
The API uses RapidAPI for authentication. All requests require the `X-RapidAPI-Key` header.

**Environment Variable:**
```env
RAPIDAPI_KEY=your_rapid_api_key_here
```

## API Client Setup

### Base Client (`src/lib/streaming-api.ts`)
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

export { client };
```

**Note:** Next.js automatically loads `.env.local` files. No need for dotenv or additional configuration.

## Core API Functions

### 1. Search Shows by Title

**Function:**
```typescript
export async function searchShows(
  title: string, 
  country: string = 'us'
) {
  try {
    const response = await client.showsApi.searchShowsByTitle({
      title,
      country,
      showType: undefined, // Optional: 'movie' | 'series'
      outputLanguage: 'en'
    });
    return response;
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
}
```

**Example Usage:**
```typescript
const results = await searchShows('Inception', 'us');
console.log(results); // Array of show objects
```

**Response Structure:**
```typescript
{
  id: string;           // Unique show ID
  title: string;        // Show title
  showType: 'movie' | 'series';
  firstAirYear: number;
  lastAirYear?: number; // For series
  posterUrl?: string;
  overview?: string;
  rating?: number;      // 0-100
  genres: Array<{
    id: string;
    name: string;
  }>;
  // ... other fields
}
```

### 2. Get Show Details by ID

**Function:**
```typescript
export async function getShowById(
  id: string,
  country: string = 'us'
) {
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
```

**Example Usage:**
```typescript
const show = await getShowById('tt1375666', 'us');
console.log(show.streamingOptions); // Streaming availability
```

**Response Structure:**
```typescript
{
  id: string;
  title: string;
  showType: 'movie' | 'series';
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  genres: Genre[];
  cast: string[];
  creators?: string[];
  directors?: string[];
  imdbId: string;
  tmdbId: string;
  
  // Streaming options for the requested country
  streamingOptions: {
    [country: string]: Array<{
      service: {
        id: string;
        name: string;
        homeUrl: string;
        imageSet: {
          lightThemeImage: string;
          darkThemeImage: string;
        };
      };
      type: 'subscription' | 'free' | 'buy' | 'rent' | 'addon';
      quality: 'sd' | 'hd' | 'uhd' | 'qhd';
      link: string;          // Deep link to watch
      videoLink?: string;    // Direct video player link
      audios: Array<{
        language: string;
        region?: string;
      }>;
      subtitles: Array<{
        language: string;
        region?: string;
        closedCaptions: boolean;
      }>;
      price?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      expiresOn?: number;    // Unix timestamp
      addon?: {              // If available via addon
        id: string;
        name: string;
        homeUrl: string;
        imageSet: ImageSet;
      };
    }>;
  };
  
  // For series
  seasons?: Array<{
    seasonNumber: number;
    episodes: Episode[];
  }>;
}
```

### 3. Get Available Countries

The API supports 60+ countries. Common ones include:

```typescript
export const COUNTRIES = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
  { code: 'jp', name: 'Japan' },
  { code: 'br', name: 'Brazil' },
  { code: 'mx', name: 'Mexico' },
  { code: 'in', name: 'India' },
  // ... add more as needed
];
```

## Caching Strategy

### Client-Side Caching
Use React Query or SWR for automatic caching:

```typescript
// Install: npm install @tanstack/react-query
import { useQuery } from '@tanstack/react-query';

export function useShowSearch(title: string, country: string) {
  return useQuery({
    queryKey: ['search', title, country],
    queryFn: () => searchShows(title, country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: title.length > 2,
  });
}

export function useShowDetails(id: string, country: string) {
  return useQuery({
    queryKey: ['show', id, country],
    queryFn: () => getShowById(id, country),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
```

### Next.js Server Caching
```typescript
// Server component with caching
export async function getShow(id: string, country: string) {
  const show = await getShowById(id, country);
  return show;
}

// In page component
export const revalidate = 86400; // 24 hours
```

## Error Handling

### Wrapper Function with Error Handling
```typescript
export async function safeApiCall<T>(
  apiFunction: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await apiFunction();
  } catch (error) {
    if (error.response?.status === 429) {
      // Rate limit exceeded
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 404) {
      // Not found
      throw new Error('Content not found.');
    } else if (error.response?.status >= 500) {
      // Server error
      throw new Error('Service temporarily unavailable.');
    }
    console.error('API Error:', error);
    return fallback;
  }
}
```

**Usage:**
```typescript
const results = await safeApiCall(
  () => searchShows(query, country),
  [] // fallback empty array
);
```

## Rate Limit Management

### Request Counter (Optional)
```typescript
// src/lib/rate-limiter.ts
let requestCount = 0;
let resetTime = Date.now() + 24 * 60 * 60 * 1000;

export function checkRateLimit(): boolean {
  if (Date.now() > resetTime) {
    requestCount = 0;
    resetTime = Date.now() + 24 * 60 * 60 * 1000;
  }
  
  if (requestCount >= 95) { // Leave buffer
    return false;
  }
  
  requestCount++;
  return true;
}

export function getRemainingRequests(): number {
  return Math.max(0, 95 - requestCount);
}
```

## Streaming Service Logos

Access service logos from the API response:

```typescript
// Light theme
service.imageSet.lightThemeImage

// Dark theme
service.imageSet.darkThemeImage
```

Example:
```tsx
<img 
  src={option.service.imageSet.darkThemeImage} 
  alt={option.service.name}
  className="h-8 w-auto"
/>
```

## Deep Links

### Web Links
```typescript
// Link to service's show page
<a href={streamingOption.link} target="_blank" rel="noopener noreferrer">
  Watch on {service.name}
</a>
```

### Direct Video Links
```typescript
// Direct link to video player (if available)
{streamingOption.videoLink && (
  <a href={streamingOption.videoLink} target="_blank">
    Play Now
  </a>
)}
```

## Complete Example: API Service

```typescript
// src/lib/streaming-api.ts
import { Client, Configuration } from 'streaming-availability';

if (!process.env.RAPIDAPI_KEY) {
  throw new Error('RAPIDAPI_KEY is not set');
}

const client = new Client(
  new Configuration({
    apiKey: process.env.RAPIDAPI_KEY
  })
);

export interface SearchParams {
  title: string;
  country?: string;
  showType?: 'movie' | 'series';
}

export interface ShowDetailsParams {
  id: string;
  country?: string;
}

export class StreamingAPI {
  static async searchShows({ 
    title, 
    country = 'us', 
    showType 
  }: SearchParams) {
    try {
      const response = await client.showsApi.searchShowsByTitle({
        title,
        country,
        showType,
        outputLanguage: 'en'
      });
      return response;
    } catch (error) {
      console.error('Search error:', error);
      throw this.handleError(error);
    }
  }

  static async getShowDetails({ 
    id, 
    country = 'us' 
  }: ShowDetailsParams) {
    try {
      const response = await client.showsApi.getShow({
        id,
        country,
        outputLanguage: 'en'
      });
      return response;
    } catch (error) {
      console.error('Get show error:', error);
      throw this.handleError(error);
    }
  }

  private static handleError(error: any): Error {
    if (error.response?.status === 429) {
      return new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 404) {
      return new Error('Content not found.');
    } else if (error.response?.status >= 500) {
      return new Error('Service temporarily unavailable.');
    }
    return new Error('An unexpected error occurred.');
  }
}
```

## Testing the API

### Manual Test Script
Create a test file to verify API connectivity:

```typescript
// scripts/test-api.ts
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

  console.log('Testing Streaming Availability API...\n');

  try {
    // Test search
    console.log('Searching for "Inception"...');
    const results = await searchShows('Inception', 'us');
    console.log(`✓ Found ${results.length} results`);
    console.log(`✓ First result: ${results[0]?.title}`);

    // Test get show
    if (results[0]) {
      console.log('\nFetching show details...');
      const show = await getShowById(results[0].id, 'us');
      console.log(`✓ Title: ${show.title}`);
      console.log(`✓ Overview: ${show.overview?.substring(0, 100)}...`);

      if (show.streamingOptions?.['us']) {
        console.log(`✓ Found ${show.streamingOptions['us'].length} streaming options`);
      }
    }

    console.log('\n✅ API tests passed!');
  } catch (error) {
    console.error('❌ API test failed:', error);
    process.exit(1);
  }
}

testAPI();
```

**Install tsx for running TypeScript:**
```bash
npm install -D tsx
```

**Run the test:**
```bash
npx tsx scripts/test-api.ts
```

**Note:** The manual env loading is only needed for standalone test scripts. Next.js automatically loads `.env.local` files when running the app.

## API Response Examples

### Search Results Example
```json
[
  {
    "id": "tt1375666",
    "title": "Inception",
    "showType": "movie",
    "firstAirYear": 2010,
    "posterUrl": "https://...",
    "overview": "A thief who steals...",
    "rating": 83,
    "genres": [
      { "id": "action", "name": "Action" },
      { "id": "scifi", "name": "Science Fiction" }
    ]
  }
]
```

### Show Details Example
```json
{
  "id": "tt1375666",
  "title": "Inception",
  "streamingOptions": {
    "us": [
      {
        "service": {
          "id": "netflix",
          "name": "Netflix",
          "imageSet": {
            "darkThemeImage": "https://..."
          }
        },
        "type": "subscription",
        "quality": "uhd",
        "link": "https://www.netflix.com/title/70131314",
        "audios": [
          { "language": "eng" }
        ],
        "subtitles": [
          { "language": "eng", "closedCaptions": true }
        ]
      },
      {
        "service": {
          "id": "prime",
          "name": "Prime Video"
        },
        "type": "rent",
        "quality": "hd",
        "link": "https://...",
        "price": {
          "amount": 3.99,
          "currency": "USD",
          "formatted": "$3.99"
        }
      }
    ]
  }
}
```

## Important Reminders

1. **Rate Limits**: Free tier has 100 requests/day
2. **Caching**: Always cache responses to conserve API calls
3. **Error Handling**: Always wrap API calls in try-catch
4. **Country Codes**: Use ISO 3166-1 alpha-2 codes (lowercase)
5. **Show IDs**: The API accepts IMDb IDs, TMDB IDs, or internal IDs
6. **Deep Links**: Mobile deep links work for native apps
7. **Image URLs**: Use CDN URLs directly, they're optimized

## Troubleshooting

### Common Issues

**401 Unauthorized**
- Check RAPIDAPI_KEY is set correctly
- Verify API key is active on RapidAPI dashboard

**429 Rate Limit**
- You've exceeded 100 requests/day
- Wait for reset or upgrade plan
- Implement better caching

**404 Not Found**
- Show ID doesn't exist
- Check show ID format (should be IMDb or TMDB ID)

**500 Server Error**
- Temporary API issue
- Implement retry logic
- Show fallback UI to user
