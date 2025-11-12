# Streaming Availability Finder - Project Brief

## Project Overview
Build a web application that allows users to search for movies and TV shows and discover where they're available to stream across different countries and services. The app uses the Movie of the Night Streaming Availability API to provide accurate, real-time streaming data.

## Core Functionality
1. **Search**: Users input a movie or TV show title
2. **Results**: Display matching titles with posters and basic info
3. **Details**: Show comprehensive streaming availability by country and service
4. **Deep Links**: Provide direct links to watch content on streaming platforms

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Movie of the Night Streaming Availability API (via RapidAPI)
- **SDK**: @movie-of-the-night/streaming-availability-sdk
- **Deployment**: Vercel
- **Tool Management**: Mise (Node.js 22)

## Project Setup Requirements

### Environment Setup
```bash
# Initialize with Mise
mise use node@22

# Create Next.js project
npx create-next-app@latest streaming-finder
# Options: TypeScript ✓, App Router ✓, Tailwind CSS ✓, src/ directory ✓

# Install dependencies
npm install @movie-of-the-night/streaming-availability-sdk
npm install -D @types/node
```

### Environment Variables
Create `.env.local` with:
```
RAPIDAPI_KEY=your_api_key_here
```

### Mise Configuration
Create `.mise.toml`:
```toml
[tools]
node = "22"

[env]
NODE_ENV = "development"
RAPIDAPI_KEY = ""

[tasks.dev]
description = "Start development server"
run = "npm run dev"

[tasks.build]
description = "Build for production"
run = "npm run build"

[tasks.setup]
description = "Install dependencies"
run = "npm install"

[tasks.lint]
description = "Run linter"
run = "npm run lint"
```

## Project Structure
```
streaming-finder/
├── .mise.toml
├── .env.local
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage with search
│   │   ├── globals.css             # Global styles
│   │   ├── search/
│   │   │   └── page.tsx            # Search results page
│   │   └── show/
│   │       └── [id]/
│   │           └── page.tsx        # Show detail page
│   ├── components/
│   │   ├── SearchBar.tsx           # Search input component
│   │   ├── ShowCard.tsx            # Show preview card
│   │   ├── ShowDetails.tsx         # Detailed show information
│   │   ├── StreamingOptions.tsx    # List of streaming options
│   │   ├── CountrySelector.tsx     # Country picker
│   │   └── LoadingSpinner.tsx      # Loading states
│   ├── lib/
│   │   ├── streaming-api.ts        # API client wrapper
│   │   ├── types.ts                # TypeScript types
│   │   └── utils.ts                # Helper functions
│   └── hooks/
│       └── useDebounce.ts          # Debounce hook for search
└── public/
    └── images/                      # Static assets
```

## Key Features to Implement

### 1. Homepage (/)
- Clean, minimal design
- Prominent search bar
- Sample suggestions or trending content
- Instructions on how to use the app

### 2. Search Results (/search?q=title)
- Display grid of matching shows
- Each card shows:
  - Poster image
  - Title
  - Year
  - Type (Movie/Series)
  - Quick streaming info (e.g., "On Netflix")
- Click card to navigate to detail page

### 3. Show Detail Page (/show/[id])
- Large poster/backdrop
- Full show information:
  - Title, year, rating, genres
  - Overview/description
  - Cast
- Country selector dropdown
- Streaming options grouped by type:
  - Subscription services (Netflix, Disney+, etc.)
  - Rental/Purchase options (with prices)
  - Free options
  - Addon channels
- Each streaming option shows:
  - Service logo
  - Video quality (SD/HD/UHD)
  - Price (if applicable)
  - "Watch Now" button (deep link)
  - Available audio/subtitle languages

## API Integration Guidelines

### Rate Limiting
- Free tier: 100 requests/day
- Implement client-side caching
- Cache search results for 5 minutes
- Cache show details for 24 hours
- Use Next.js built-in caching where possible

### Error Handling
- Handle API errors gracefully
- Show user-friendly error messages
- Implement retry logic for failed requests
- Display fallback UI when API is unavailable

### API Endpoints to Use
1. **Search by Title**: `showsApi.searchShowsByTitle()`
2. **Get Show Details**: `showsApi.getShow()`
3. **Get Countries**: Use predefined list of supported countries

## Design Guidelines

### Color Scheme
- Primary: Modern blue/purple gradient
- Background: Dark mode friendly (dark gray, not pure black)
- Accent: Bright colors for CTAs
- Text: High contrast for accessibility

### Typography
- Headings: Bold, clear hierarchy
- Body: Readable font size (16px minimum)
- Use system fonts for performance

### Layout
- Responsive: Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Max width: 1400px for content

### Components
- Cards: Rounded corners, subtle shadows
- Buttons: Clear hover states, accessible
- Images: Lazy loading, proper alt text
- Loading states: Skeleton screens or spinners

## User Experience Considerations

### Performance
- Use Next.js Image component for optimized images
- Implement lazy loading for off-screen content
- Minimize JavaScript bundle size
- Server-side render when possible

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratio compliance (WCAG AA)

### Mobile Experience
- Touch-friendly tap targets (44px minimum)
- Responsive images and layouts
- Optimized for slow connections
- No horizontal scrolling

## Development Workflow

### Initial Setup Phase
1. Set up Next.js project with TypeScript and Tailwind
2. Configure Mise for Node.js version management
3. Install Streaming Availability SDK
4. Set up environment variables
5. Create basic folder structure

### Core Development Phase
1. Implement API client wrapper
2. Build homepage with search functionality
3. Create search results page
4. Build show detail page with streaming options
5. Add country selector
6. Implement caching strategy

### Polish Phase
1. Add loading states and error handling
2. Optimize images and performance
3. Implement responsive design
4. Add animations and transitions
5. Test across devices and browsers

### Deployment Phase
1. Test production build locally
2. Configure Vercel deployment
3. Set environment variables in Vercel
4. Deploy and test live site

## Testing Checklist
- [ ] Search returns accurate results
- [ ] Show details load correctly
- [ ] Streaming options display properly
- [ ] Country selector works
- [ ] Deep links navigate correctly
- [ ] Mobile responsive on all pages
- [ ] Loading states show appropriately
- [ ] Error messages display when needed
- [ ] Images load and are optimized
- [ ] Accessibility standards met

## API Key Setup
1. Visit: https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability
2. Sign up for free account (no credit card required)
3. Subscribe to Basic (Free) plan
4. Copy API key from dashboard
5. Add to `.env.local` file

## Important Notes
- The API has a 100 requests/day limit on free tier
- Cache aggressively to conserve API calls
- The API uses IMDb/TMDB IDs for show identification
- Deep links work for native apps on mobile devices
- Some streaming services may not be available in all countries

## Success Criteria
- Users can search for any movie/TV show
- Results are accurate and fast (< 2 seconds)
- Streaming availability is clearly displayed
- Users can filter by country
- Deep links work correctly
- App is responsive and accessible
- No console errors or warnings
- API rate limits are respected

## Future Enhancements (Out of Scope for v1)
- User accounts and watchlists
- Price tracking and alerts
- Filter by streaming service
- Recently viewed history
- Share functionality
- PWA capabilities
- Multiple language support

## Resources
- [Movie of the Night API Docs](https://docs.movieofthenight.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
