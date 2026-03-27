import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Waves, 
  ExternalLink, 
  Globe, 
  Wifi,
  ArrowLeft,
  Layers
} from 'lucide-react';
import { getMagnitudeColor, getMagnitudeLabel } from '@utils/colorScale';
import { EarthquakeDetailProps } from '@types';

const EarthquakeDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<EarthquakeDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const detailUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/${id}.geojson`;
        const response = await fetch(detailUrl);
        if (!response.ok) throw new Error('Failed to fetch data');
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading earthquake telemetry...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-bold">Error: {error || 'No data available'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { properties, geometry } = data;
  const lon = geometry.coordinates[0];
  const lat = geometry.coordinates[1];
  const depth = geometry.coordinates[2];
  
  const magColorHex = `#${getMagnitudeColor(properties.mag).toString(16).padStart(6, '0')}`;
  const magLabel = getMagnitudeLabel(properties.mag);
  
  const originData = properties.products?.origin?.[0]?.properties;

  const eventTime = new Date(properties.time).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' });
  const updateTime = new Date(properties.updated).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

  // Map Bounding Box for OpenStreetMap Iframe
  const mapOffset = 2;
  const bbox = `${lon - mapOffset},${lat - mapOffset},${lon + mapOffset},${lat + mapOffset}`;

  // Visual Gauge Calculations
  const magPercentage = Math.min((properties.mag / 10) * 100, 100);
  const depthPercentage = Math.min((depth / 700) * 100, 100); 
  const sigPercentage = Math.min(((properties.sig || 0) / 1000) * 100, 100); 

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold px-2 cursor-pointer w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header / Hero Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-96 h-96 blur-[100px] opacity-20 rounded-full pointer-events-none"
            style={{ backgroundColor: magColorHex }}
          />

          <div className="flex-1 space-y-4 z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 shadow-sm">
                {properties.status} Status
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: magColorHex }}>
                {magLabel} Earthquake
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {properties.place}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 text-slate-500 font-medium">
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Clock className="w-5 h-5 text-slate-400" />
                {eventTime}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-8 rounded-full border-8 shadow-lg z-10 bg-white" 
               style={{ borderColor: `${magColorHex}40` }}>
            <span className="text-6xl font-black tracking-tighter" style={{ color: magColorHex }}>
              {properties.mag.toFixed(1)}
            </span>
            <span className="text-sm font-bold uppercase tracking-widest mt-1 text-slate-400">
              Magnitude
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Interactive Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-87.5 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold flex items-center gap-2 text-slate-800">
                <MapPin className="w-5 h-5 text-blue-500" /> Epicenter Map
              </h3>
            </div>
            <div className="flex-1 w-full bg-slate-200">
              <iframe
                title="Earthquake Epicenter"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Visual Data Gauges */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center space-y-8">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
              <Activity className="w-5 h-5 text-purple-500" /> Event Metrics
            </h3>

            {/* Magnitude Bar */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                <span>Magnitude Scale</span>
                <span>{properties.mag.toFixed(1)} / 10.0</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${magPercentage}%`, backgroundColor: magColorHex }}
                />
              </div>
            </div>

            {/* Depth Visualizer */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1"><Layers className="w-4 h-4 text-amber-600"/> Depth Focus</span>
                <span>{depth} km</span>
              </div>
              <div className="relative w-full bg-linear-to-r from-amber-200 via-orange-500 to-red-900 rounded-full h-3 mt-2 border border-slate-200">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-5 bg-white border-2 shadow-md rounded-full transition-all duration-1000" 
                  style={{ left: `calc(${depthPercentage}% - 8px)`, borderColor: '#333' }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5 uppercase">
                <span>Surface</span>
                <span>Mantle (700km+)</span>
              </div>
            </div>

            {/* Significance Gauge */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                <span>USGS Significance</span>
                <span>{properties.sig}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-slate-800 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${sigPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Scores {'>'} 600 are considered major events.
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Coordinates Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2 text-slate-800">
              <Globe className="w-5 h-5 text-blue-500" /> Exact Coordinates
            </h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Latitude</p>
                <p className="text-lg font-mono font-semibold text-slate-700">{lat.toFixed(4)}°</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-lg font-mono font-semibold text-slate-700">{lon.toFixed(4)}°</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Distance to closest station</p>
                <p className="text-lg font-semibold text-slate-700">{properties.dmin ? `${properties.dmin} degrees` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Impact Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2 text-slate-800">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Impact Reports
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-sm font-semibold text-slate-600">Tsunami Alert</span>
                <span className={`font-bold flex items-center gap-1 px-2 py-1 rounded-md text-xs uppercase tracking-wider ${properties.tsunami ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  <Waves className="w-4 h-4" />
                  {properties.tsunami ? 'Warning' : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm font-semibold text-slate-600">Felt Reports</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{properties.felt ?? '0'}</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm font-semibold text-slate-600">Max Intensity (MMI)</span>
                <span className="font-bold text-slate-800">{properties.mmi ? properties.mmi.toFixed(1) : 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Network Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2 text-slate-800">
              <Wifi className="w-5 h-5 text-teal-500" /> Sensor Network
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2">
                <span className="text-sm font-semibold text-slate-600">Network Provider</span>
                <span className="font-bold uppercase text-slate-800 bg-slate-100 px-3 py-1 rounded-md">{properties.net}</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm font-semibold text-slate-600">Magnitude Type</span>
                <span className="font-bold uppercase text-slate-800">{properties.magType}</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm font-semibold text-slate-600">Stations Used</span>
                <span className="font-bold text-slate-800">{properties.nst ?? originData?.['num-stations-used'] ?? 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Telemetry Section */}
        {originData && (
          <div className="bg-slate-900 text-slate-300 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 overflow-hidden relative">
            {/* Subtle tech background detail */}
            <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
              <Activity className="w-96 h-96" />
            </div>

            <div className="md:w-1/3 space-y-3 z-10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-400" /> Telemetry Data
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Advanced structural analysis compiled from <span className="text-emerald-400 font-bold">{originData['num-phases-used']}</span> distinct phase markers across the monitoring array.
              </p>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6 z-10">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Azimuthal Gap</p>
                <p className="text-xl font-mono text-white">{originData['azimuthal-gap']}°</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Mag Error</p>
                <p className="text-xl font-mono text-white">±{originData['magnitude-error']}</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Horiz. Error</p>
                <p className="text-xl font-mono text-white">±{originData['horizontal-error']} <span className="text-sm">km</span></p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Vert. Error</p>
                <p className="text-xl font-mono text-white">±{originData['vertical-error']} <span className="text-sm">km</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 pt-6 pb-10">
          <p className="font-medium bg-slate-200 px-4 py-2 rounded-full text-slate-600">
            Last updated: {updateTime}
          </p>
          <a 
            href={properties.url} 
            target="_blank" 
            rel="noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-md transition-all font-bold text-slate-800 shadow-sm group"
          >
            <Globe className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" />
            View Official USGS Report
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default EarthquakeDashboard;