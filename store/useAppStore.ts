import { create } from 'zustand';
import { NewsItemType, EarthquakeFeature } from '@types';
import { fetchSavedEarthquakes } from '@services/saveDetailService';

interface AppState {
  // News Cache
  news: NewsItemType[];
  newsLastUpdated: string;
  setNews: (news: NewsItemType[], time: string) => void;

  // Saved Earthquakes Cache
  savedEarthquakes: any[];
  savedLoaded: boolean;
  fetchSaved: () => Promise<void>;
  addSavedEarthquake: (eq: any) => void; // Call this when saving from the globe

  // Globe Cache
  globeEarthquakes: EarthquakeFeature[];
  globeLastUpdated: Date | null;
  setGlobeEarthquakes: (eqs: EarthquakeFeature[], date: Date) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  news:[],
  newsLastUpdated: "",
  setNews: (news, time) => set({ news, newsLastUpdated: time }),

  savedEarthquakes:[],
  savedLoaded: false,
  fetchSaved: async () => {
    if (get().savedLoaded) return; // Don't refetch if already loaded
    const data = await fetchSavedEarthquakes();
    set({ savedEarthquakes: data, savedLoaded: true });
  },
  addSavedEarthquake: (eq) => set((state) => ({ 
    savedEarthquakes: [...state.savedEarthquakes, eq] 
  })),

  globeEarthquakes:[],
  globeLastUpdated: null,
  setGlobeEarthquakes: (globeEarthquakes, globeLastUpdated) => set({ globeEarthquakes, globeLastUpdated }),
}));