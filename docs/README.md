# Streaming Finder

A modern web application that helps users discover where they can watch their favorite movies and TV shows across different countries and streaming services.

![Streaming Finder Screenshot](./docs/screenshot.png)

## Features

- 🔍 **Smart Search** - Find any movie or TV show by title
- 🌍 **Global Coverage** - Check availability in 60+ countries
- 📺 **All Services** - Netflix, Disney+, Prime Video, Hulu, and more
- 💰 **Price Comparison** - See rental and purchase options with prices
- 🔗 **Direct Links** - One-click access to watch on streaming platforms
- 📱 **Responsive Design** - Works beautifully on all devices
- ⚡ **Fast Performance** - Optimized for speed with smart caching

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API**: [Movie of the Night Streaming Availability API](https://www.movieofthenight.com/about/api)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Tool Management**: [Mise](https://mise.jdx.dev/)

## Prerequisites

- Node.js 22 or higher
- npm or yarn
- RapidAPI account (free tier available)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/streaming-finder.git
cd streaming-finder
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using Mise (recommended):
```bash
mise install
mise run setup
```

### 3. Get API Key

1. Visit [RapidAPI Streaming Availability](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability)
2. Sign up for a free account (no credit card required)
3. Subscribe to the **Basic (Free)** plan
4. Copy your API key from the dashboard

### 4. Configure Environment

Create a `.env.local` file in the project root:

```env
RAPIDAPI_KEY=your_api_key_here
```

### 5. Run Development Server

Using npm:
```bash
npm run dev
```

Using Mise:
```bash
mise dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
streaming-finder/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout
│   │   ├── search/            # Search results page
│   │   └── show/[id]/         # Show detail page
│   ├── components/            # React components
│   │   ├── SearchBar.tsx
│   │   ├── ShowCard.tsx
│   │   ├── ShowDetails.tsx
│   │   ├── CountrySelector.tsx
│   │   ├── StreamingOptions.tsx
│   │   └── ...
│   ├── lib/                   # Utilities and API
│   │   ├── streaming-api.ts   # API client
│   │   ├── types.ts           # TypeScript types
│   │   ├── utils.ts           # Helper functions
│   │   └── countries.ts       # Country data
│   └── hooks/                 # Custom React hooks
│       └── useDebounce.ts
├── public/                    # Static assets
├── .env.local                 # Environment variables (create this)
├── .mise.toml                 # Mise configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies
```

## Available Scripts

### npm scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Mise tasks
- `mise dev` - Start development server
- `mise build` - Build for production
- `mise lint` - Run linter
- `mise setup` - Install dependencies

## API Usage

This app uses the [Movie of the Night Streaming Availability API](https://www.movieofthenight.com/about/api) which provides:

- Comprehensive streaming data for 60+ countries
- 600+ streaming services
- 400,000+ movies and shows
- Real-time availability updates
- Rental/purchase pricing
- Deep links to streaming platforms

**Free Tier Limits:**
- 100 requests per day
- All features included
- No credit card required

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/streaming-finder)

1. Click the button above or run:
   ```bash
   vercel
   ```

2. Set environment variable in Vercel dashboard:
   - `RAPIDAPI_KEY` = your API key

3. Deploy! Your app will be live in minutes.

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- AWS
- Google Cloud
- DigitalOcean
- Any platform supporting Node.js

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RAPIDAPI_KEY` | Your RapidAPI key for Streaming Availability API | Yes |
| `NODE_ENV` | Set to `production` in production | No |

## Performance

- **Lighthouse Score**: 90+ across all metrics
- **Page Load Time**: < 2 seconds on 4G
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Known Limitations

- Free API tier limited to 100 requests/day
- Some streaming services may not be available in all countries
- Availability data updated daily (not real-time)
- No user authentication or watchlist features (coming in future versions)

## Roadmap

### Phase 2
- [ ] Filter by streaming service
- [ ] Sort options (rating, year, title)
- [ ] Recently viewed shows
- [ ] Share functionality
- [ ] Popular/trending section

### Phase 3
- [ ] User accounts
- [ ] Watchlist feature
- [ ] Price tracking and alerts
- [ ] Advanced filters
- [ ] Recommendation engine

## FAQ

### How often is streaming data updated?
The API updates availability data at least every 24 hours.

### Can I use this commercially?
The free API tier is for personal use only. For commercial use, contact Movie of the Night for licensing.

### Why are some shows not available in my country?
Streaming rights vary by country. Content may be available on services not supported by the API or may not have streaming rights in your region.

### What happens if I exceed the free tier limit?
You'll receive a rate limit error. You can either wait for the daily reset or upgrade to a paid plan on RapidAPI.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Movie of the Night API](https://www.movieofthenight.com/about/api)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

## Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs/)
2. Search [existing issues](https://github.com/yourusername/streaming-finder/issues)
3. Create a [new issue](https://github.com/yourusername/streaming-finder/issues/new)

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/streaming-finder](https://github.com/yourusername/streaming-finder)

---

Made with ❤️ by [Your Name](https://yourwebsite.com)
