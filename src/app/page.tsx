import SearchBar from '@/components/SearchBar';
import { Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Find Where to Stream
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow">
            Search for any movie or TV show and discover where you can watch it across different countries and streaming services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-16">
          <SearchBar autoFocus variant="light" />
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Search</h3>
            <p className="text-white/80">
              Find any movie or TV show by title across thousands of options
            </p>
          </div>

          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Global Coverage</h3>
            <p className="text-white/80">
              Check availability in 60+ countries worldwide
            </p>
          </div>

          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-4xl mb-4">📺</div>
            <h3 className="text-xl font-semibold mb-2 text-white">All Services</h3>
            <p className="text-white/80">
              Netflix, Disney+, Prime Video, Hulu, and hundreds more
            </p>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="flex justify-center mt-12">
          <a
            href="https://github.com/jacobpmeyer/wheretostream"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
            aria-label="View source on GitHub"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
      </main>
    </div>
  );
}
