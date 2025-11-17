import Link from 'next/link';
import { Film } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <Film className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-black">Where to Stream</span>
          </Link>
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
