export interface USGSGeometry {
  type: 'Point';
  coordinates: [number, number, number];
}

export interface USGSProperties {
  mag: number;
  place: string;
  time: number;
  updated: number;
  tz: number | null;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number | null;
  gap: number | null;
  magType: string;
  type: string;
  title: string;
}

export interface EarthquakeFeature {
  type: 'Feature';
  properties: USGSProperties;
  geometry: USGSGeometry;
  id: string;
}

export interface USGSFeatureCollection {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
  bbox?: number[];
}

export interface OriginProduct {
  properties: {
    depth: string;
    latitude: string;
    longitude: string;
    'num-stations-used': string;
    'num-phases-used': string;
    'horizontal-error': string;
    'vertical-error': string;
    'azimuthal-gap': string;
    'magnitude-error': string;
  };
}

export interface USGSDetailProperties extends USGSProperties {
  products: {
    origin?: OriginProduct[];
  };
}

export type EarthquakeDetailProps = Omit<EarthquakeFeature, 'properties'> & {
  properties: USGSDetailProperties;
};