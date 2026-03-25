import { useState, useCallback } from 'react';
import { fetchEarthquakes } from '@services/earthquakeAPI';
import { EarthquakeFeature, TimeRangeType, MagnitudeThresholdType } from '@types';

export const useEarthquakes = () => { 
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('day');
  const [magThreshold, setMagThreshold] = useState<MagnitudeThresholdType>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadEarthquakes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEarthquakes(timeRange, magThreshold);
      setEarthquakes(data.features || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [timeRange, magThreshold]); 

  
  return {
    earthquakes,
    loading,
    error,
    timeRange,
    magThreshold,
    lastUpdated,
    setTimeRange,
    setMagThreshold,
    refresh: loadEarthquakes
  };
};

