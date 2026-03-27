import { useState, useCallback, useEffect } from 'react';
import { fetchEarthquakes } from '@services/earthquakeAPI';
import { TimeRangeType, MagnitudeThresholdType } from '@types';
import { useAppStore } from '../store/useAppStore';

export const useEarthquakes = () => { 
  const { 
    globeEarthquakes: earthquakes, 
    globeLastUpdated: lastUpdated, 
    lastTimeRange,
    lastMagThreshold,
    setGlobeEarthquakes 
  } = useAppStore();

  const[loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  
  const [timeRange, setTimeRange] = useState<TimeRangeType>(lastTimeRange || 'day');
  const[magThreshold, setMagThreshold] = useState<MagnitudeThresholdType>(lastMagThreshold || 'all');

  const loadEarthquakes = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && earthquakes.length > 0 && timeRange === lastTimeRange && magThreshold === lastMagThreshold) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEarthquakes(timeRange, magThreshold);
      setGlobeEarthquakes(data.features ||[], new Date(), timeRange, magThreshold);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },[timeRange, magThreshold, earthquakes.length, lastTimeRange, lastMagThreshold, setGlobeEarthquakes]); 

  // Auto-fetch ONLY if parameters change or if there's no data
  useEffect(() => {
    loadEarthquakes();
  },[timeRange, magThreshold, loadEarthquakes]);
  
  return {
    earthquakes,
    loading,
    error,
    timeRange,
    magThreshold,
    lastUpdated,
    setTimeRange,
    setMagThreshold,
    refresh: () => loadEarthquakes(true) 
  };
};