<div align="center">

# 🎬 Where to Stream

### Find any movie or TV show across streaming platforms worldwide

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://wheretostream.jacobmeyer.dev)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<img src="https://img.shields.io/github/stars/jacobpmeyer/wheretostream?style=social" alt="GitHub stars">
<img src="https://img.shields.io/github/forks/jacobpmeyer/wheretostream?style=social" alt="GitHub forks">

</div>

---

## ✨ Features

- 🔍 **Smart Search** - Find any movie or TV show by title across thousands of options
- 🌍 **Global Coverage** - Check availability in 60+ countries worldwide
- 📺 **All Services** - Netflix, Disney+, Prime Video, Hulu
- 🎯 **Subtitle Detection** - Check for English and Japanese subtitle availability
- 📱 **Responsive Design** - Beautiful UI that works on desktop and mobile
- ⚡️ **Fast Performance** - Built with Next.js 15 and Turbopack

## 🚀 Quick Start

### Prerequisites

- Node.js 22 or higher
- [mise](https://mise.jdx.dev/) (recommended) or npm
- RapidAPI key for [Streaming Availability API](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability)

### Installation

1. Clone the repository
```bash
git clone https://github.com/jacobpmeyer/wheretostream.git
cd wheretostream
```

2. Install dependencies
```bash
npm install
# or if using mise
mise run setup
```

3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
RAPIDAPI_KEY=your_api_key_here
```

Or if using mise, add to `.mise.toml`:
```toml
[env]
RAPIDAPI_KEY = "your_api_key_here"
```

4. Run the development server
```bash
npm run dev
# or if using mise
mise run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API:** [Streaming Availability API](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability)
- **Deployment:** [Vercel](https://vercel.com/)
- **Dev Tools:** [mise](https://mise.jdx.dev/), ESLint

## 📂 Project Structure

```
wheretostream/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── search/       # Search results page
│   │   └── show/         # Show details page
│   ├── components/       # React components
│   │   ├── ConditionalHeader.tsx
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ShowCard.tsx
│   │   ├── ShowDetails.tsx
│   │   ├── StreamingOptionCard.tsx
│   │   └── StreamingOptions.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useDebounce.ts
│   └── lib/              # Utilities and API
│       ├── streaming-api.ts
│       └── types.ts
├── .mise.toml            # mise configuration
└── package.json
```

## 🎨 Features in Detail

### Search Functionality
- Fast server-side search
- Clean search results interface
- Country-specific availability

### Show Details
- Cast and director information
- Overview and plot summary
- Streaming availability by country

### Streaming Options
- Service deduplication (no duplicate listings)
- Quality indicators (SD, HD, UHD)
- Direct links to watch on streaming platforms
- Subtitle availability indicators

## 🌐 Deployment

The app is deployed on Vercel and available at [wheretostream.jacobmeyer.dev](https://wheretostream.jacobmeyer.dev)

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jacobpmeyer/wheretostream)

Don't forget to add your `RAPIDAPI_KEY` environment variable in Vercel project settings!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/jacobpmeyer/wheretostream/issues).

## 👨‍💻 Author

**Jacob Meyer**

- Website: [jacobmeyer.dev](https://jacobmeyer.dev)
- GitHub: [@jacobpmeyer](https://github.com/jacobpmeyer)

---

<div align="center">

Made with ❤️ using Next.js and the Streaming Availability API

⭐️ Star this repo if you find it useful!

</div>
