import axios from 'axios';

const BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

// Available time ranges
export const TIME_RANGES = {
  HOUR: ['all_hour', 'significant_hour', '4.5_hour', '2.5_hour', '1.0_hour'],
  DAY: ['all_day', 'significant_day', '4.5_day', '2.5_day', '1.0_day'],
  WEEK: ['all_week', 'significant_week', '4.5_week', '2.5_week', '1.0_week'],
  MONTH: ['all_month', 'significant_month', '4.5_month', '2.5_month', '1.0_month']
};

// Available magnitude thresholds
export const MAG_THRESHOLDS = {
  ALL: 'all',
  M1: '1.0',
  M2_5: '2.5',
  M4_5: '4.5',
  SIGNIFICANT: 'significant'
};

/**
 * Fetch earthquakes from USGS API
 * @param {string} timeRange - Time range (hour, day, week, month)
 * @param {string} magThreshold - Magnitude threshold (all, 1.0, 2.5, 4.5, significant)
 */
export const fetchEarthquakes = async (timeRange = TIME_RANGES.DAY, magThreshold = MAG_THRESHOLDS.ALL) => {
  try {
    const url = `${BASE_URL}/${magThreshold}_${timeRange}.geojson`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    throw error;
  }
};

/**
 * Fetch details for a specific earthquake
 * @param {string} detailUrl - Detail URL from earthquake feature
 */
export const fetchEarthquakeDetails = async (detailUrl) => {
  try {
    const response = await axios.get(detailUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching earthquake details:', error);
    throw error;
  }
};