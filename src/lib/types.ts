export interface Show {
  id: string;
  title: string;
  showType: 'movie' | 'series';
  firstAirYear?: number;
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
  type?: 'subscription' | 'free' | 'buy' | 'rent' | 'addon';
  quality?: 'sd' | 'hd' | 'uhd' | 'qhd';
  link: string;
  videoLink?: string;
  price?: {
    amount: number;
    currency: string;
    formatted: string;
  };
  addon?: Service;
  audios?: Array<{ language: string; region?: string }>;
  subtitles?: Array<{
    language: string;
    region?: string;
    closedCaptions: boolean;
  }>;
  expiresOn?: number;
}

export interface Service {
  id: string;
  name: string;
  homeUrl?: string;
  imageSet: {
    lightThemeImage: string;
    darkThemeImage: string;
  };
}
