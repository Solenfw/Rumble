import * as THREE from 'three';
import { EarthquakeContextData } from './store';


export interface VisualizationItem {
  id: string;
  title: string;
  image: string;
  link?: string;
}

export interface OptionsPanelProps {
  earthquakeData: EarthquakeContextData;
}

export interface InfoPanelProps extends EarthquakeContextData {
  camera : THREE.Camera;
}

export interface InputBoxProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
}