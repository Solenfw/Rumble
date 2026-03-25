import React from 'react';
import { 
  Activity, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Waves, 
  ExternalLink, 
  Globe, 
  Wifi
} from 'lucide-react';

import {  getMagnitudeColor, getMagnitudeLabel } from '@utils/colorScale';
import { EarthquakeDetailProps } from '@types';

interface Props {
  data: EarthquakeDetailProps;
}

const EarthquakeDashboard: React.FC<Props> = ({ data }) => {
  const { properties, geometry } = data;

  const magColorHex = `#${getMagnitudeColor(properties.mag).toString(16).padStart(6, '0')}`;
  const magLabel = getMagnitudeLabel(properties.mag);
  
  const originData = properties.products?.origin?.[0]?.properties;

  const eventTime = new Date(properties.time).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  });
  const updateTime = new Date(properties.updated).toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header / Hero Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Decorative colored glow based on magnitude */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-10 rounded-full pointer-events-none"
            style={{ backgroundColor: magColorHex }}
          />

          <div className="flex-1 space-y-4 z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100">
                {properties.status} Status
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: magColorHex }}>
                {magLabel} Earthquake
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              {properties.place}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                {eventTime}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-8 rounded-full border-8 shadow-inner z-10" 
               style={{ borderColor: `${magColorHex}40`, backgroundColor: `${magColorHex}10` }}>
            <span className="text-6xl font-black" style={{ color: magColorHex }}>
              {properties.mag.toFixed(1)}
            </span>
            <span className="text-sm font-bold uppercase tracking-widest mt-1 text-slate-500">
              Magnitude
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Location Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2">
              <MapPin className="w-5 h-5 text-blue-500" /> Location Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Latitude</p>
                <p className="text-xl font-semibold">{geometry.coordinates[1].toFixed(4)}°</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Longitude</p>
                <p className="text-xl font-semibold">{geometry.coordinates[0].toFixed(4)}°</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Depth</p>
                <p className="text-xl font-semibold">{geometry.coordinates[2]} km</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Minimum Distance</p>
                <p className="text-xl font-semibold">{properties.dmin ? `${properties.dmin} km` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Significance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Sig Index</span>
                <span className="font-bold text-lg">{properties.sig}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tsunami Alert</span>
                <span className={`font-bold flex items-center gap-1 ${properties.tsunami ? 'text-red-500' : 'text-emerald-500'}`}>
                  <Waves className="w-4 h-4" />
                  {properties.tsunami ? 'Warning' : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Felt Reports</span>
                <span className="font-bold">{properties.felt ?? '0'}</span>
              </div>
            </div>
          </div>

          {/* Network Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2">
              <Wifi className="w-5 h-5 text-purple-500" /> Network
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Station Code</span>
                <span className="font-bold uppercase">{properties.net}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Mag Type</span>
                <span className="font-bold uppercase">{properties.magType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Stations Used</span>
                <span className="font-bold">{properties.nst ?? originData?.['num-stations-used'] ?? 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Telemetry Section */}
        {originData && (
          <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> Telemetry Data
              </h3>
              <p className="text-sm text-slate-400">
                Advanced structural analysis compiled from {originData['num-phases-used']} phase markers.
              </p>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gap</p>
                <p className="text-lg font-mono text-white">{originData['azimuthal-gap']}°</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Mag Error</p>
                <p className="text-lg font-mono text-white">±{originData['magnitude-error']}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Horiz. Error</p>
                <p className="text-lg font-mono text-white">±{originData['horizontal-error']} km</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Vert. Error</p>
                <p className="text-lg font-mono text-white">±{originData['vertical-error']} km</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 pt-4">
          <p>Last updated: {updateTime}</p>
          <a 
            href={properties.url} 
            target="_blank" 
            rel="noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 shadow-sm"
          >
            <Globe className="w-4 h-4" />
            View Official USGS Report
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default EarthquakeDashboard;