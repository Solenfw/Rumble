import { EarthquakeFeature } from './geojson';
import { Session, User } from '@supabase/supabase-js';

export type TimeRangeType = 'hour' | 'day' | 'week' | 'month';
export type MagnitudeThresholdType = 'all' | '1.0' | '2.5' | '4.5' | 'significant';

export interface EarthquakeContextData {
  earthquakes: EarthquakeFeature[];
  loading: boolean;
  error: string | null;
  timeRange: TimeRangeType;
  magThreshold: MagnitudeThresholdType;
  lastUpdated: Date | null;
  setTimeRange: (range: TimeRangeType) => void;
  setMagThreshold: (threshold: MagnitudeThresholdType) => void;
  refresh: () => Promise<void>;
};

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
};