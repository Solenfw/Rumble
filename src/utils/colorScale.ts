/**
 * Convert magnitude to color (green → yellow → orange → red)
 */
export const magnitudeToColor = (magnitude: number): number => {
  if (magnitude < 2.5) return 0x00ff00; // Green - minor
  if (magnitude < 4.5) return 0xffff00; // Yellow - light
  if (magnitude < 6.0) return 0xff9900; // Orange - moderate
  if (magnitude < 7.0) return 0xff3300; // Red-orange - strong
  return 0xff0000; // Red - major
};

/**
 * Get magnitude category label
 */
export const getMagnitudeLabel = (magnitude : number) : string => {
  if (magnitude < 2.5) return 'Minor';
  if (magnitude < 4.5) return 'Light';
  if (magnitude < 6.0) return 'Moderate';
  if (magnitude < 7.0) return 'Strong';
  return 'Major';
};

/**
 * Convert magnitude to marker size scale
 */
export const magnitudeToSize = (magnitude : number) : number => {
  return Math.max(0.002, magnitude * 0.0015);
};