import { create } from 'zustand';
import { NewsItemType, EarthquakeFeature, TimeRangeType, MagnitudeThresholdType } from '@types';
import { fetchSavedEarthquakes } from '@services/saveDetailService';

interface AppState {
  // --- News Cache ---
  news: NewsItemType[];
  newsLastUpdated: string;
  setNews: (news: NewsItemType[], time: string) => void;

  // --- Saved Earthquakes Cache ---
  savedEarthquakes: any[];
  savedLoaded: boolean;
  fetchSaved: () => Promise<void>;
  addSavedEarthquake: (eq: any) => void;

  // --- Globe Cache ---
  globeEarthquakes: EarthquakeFeature[];
  globeLastUpdated: Date | null;
  lastTimeRange: TimeRangeType | null;
  lastMagThreshold: MagnitudeThresholdType | null;
  setGlobeEarthquakes: (
    eqs: EarthquakeFeature[], 
    date: Date, 
    tr: TimeRangeType, 
    mt: MagnitudeThresholdType
  ) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // News
  news:[],
  newsLastUpdated: "",
  setNews: (news, time) => set({ news, newsLastUpdated: time }),

  // Saved
  savedEarthquakes:[],
  savedLoaded: false,
  fetchSaved: async () => {
    if (get().savedLoaded) return; // Skip if already loaded
    try {
      const data = await fetchSavedEarthquakes();
      set({ savedEarthquakes: data ||[], savedLoaded: true });
    } catch (error) {
      console.error("Failed to fetch saved earthquakes:", error);
    }
  },
  addSavedEarthquake: (eq) => set((state) => ({ 
    savedEarthquakes: [...state.savedEarthquakes, eq] 
  })),

  // Globe
  globeEarthquakes:[],
  globeLastUpdated: null,
  lastTimeRange: null,
  lastMagThreshold: null,
  setGlobeEarthquakes: (globeEarthquakes, globeLastUpdated, lastTimeRange, lastMagThreshold) => 
    set({ globeEarthquakes, globeLastUpdated, lastTimeRange, lastMagThreshold }),
}));