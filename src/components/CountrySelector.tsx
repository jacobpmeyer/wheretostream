'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountrySelectorProps {
  value: string;
  onChange: (country: string) => void;
  countries: Array<{ code: string; name: string; flag: string }>;
}

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
        <span className="font-medium text-black">{selectedCountry?.name}</span>
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black placeholder:text-gray-600"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-80">
            {filteredCountries.map(country => (
              <button
                key={country.code}
                onClick={() => handleSelect(country.code)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left text-black"
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
