'use client';

import { useRouter } from 'next/navigation';
import CountrySelector from './CountrySelector';
import { COUNTRIES } from '@/lib/countries';

interface CountrySelectorWithNavProps {
  currentCountry: string;
  showId: string;
  availableCountries?: Array<{ code: string; name: string; flag: string }>;
}

export default function CountrySelectorWithNav({
  currentCountry,
  showId,
  availableCountries
}: CountrySelectorWithNavProps) {
  const router = useRouter();

  const handleCountryChange = (country: string) => {
    router.push(`/show/${showId}?country=${country}`);
  };

  return (
    <CountrySelector
      value={currentCountry}
      onChange={handleCountryChange}
      countries={availableCountries || COUNTRIES}
    />
  );
}
