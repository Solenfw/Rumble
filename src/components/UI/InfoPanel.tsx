import { InfoPanelProps } from '@types';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { focusOnEarthquake } from '@utils/performRayCast';
import { Tooltip } from './Tooltip';
import { getMagnitudeStyle } from '@utils/colorScale';
import { handleSaveEarthquake } from '@services/saveDetailService';
import { useAuth } from '@contexts/authContext';
import { useAppStore } from '@store/useAppStore';

export const InfoPanel = ({ earthquakes, loading, error, lastUpdated, camera }: InfoPanelProps) => {
    const[isPanelOpen, setIsPanelOpen] = useState(false);
    const[magByFilter, setMagByFilter] = useState('all');
    const [visible, setVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { user } = useAuth();
    
    // Import the function to update global storage cache directly
    const { addSavedEarthquake } = useAppStore();

    const triggerToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 2000);
    };

    useEffect(() => {
        if (loading) setVisible(true);
    }, [loading]);

    const filteredEarthquakes = useMemo(() => {
        if (magByFilter === 'all') return earthquakes;
        return earthquakes.filter((eq) => {
            const mag = eq.properties.mag;
            if (mag === null) return false;
            if (magByFilter === 'minor') return mag < 2.5;
            if (magByFilter === 'light') return mag >= 2.5 && mag < 4.5;
            if (magByFilter === 'moderate') return mag >= 4.5 && mag < 6.0;
            if (magByFilter === 'strong') return mag >= 6.0 && mag < 7.0;
            if (magByFilter === 'major') return mag >= 7.0;
            return true;
        });
    }, [earthquakes, magByFilter]);

    return (
        <div
            className={`fixed top-0 left-0 h-full flex flex-col bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-r border-slate-700/30 shadow-2xl transition-transform duration-500 ease-out z-50
                ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ width: '380px' }}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="absolute -right-12 top-125 bg-linear-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-100 p-3 rounded-r-xl border border-l-0 border-slate-600/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(148,163,184,0.3)] hover:translate-x-1 cursor-pointer group"
                aria-label={isPanelOpen ? 'Close panel' : 'Open panel'}
            >
                {isPanelOpen ? (
                    <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
                ) : (
                    <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                )}
            </button>

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800/50 bg-linear-to-r from-slate-900/50 to-transparent shrink-0">
                <h2 className="text-2xl font-bold tracking-tight bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Live Earthquakes
                </h2>
                {lastUpdated && (
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                        Last updated {lastUpdated.toLocaleTimeString()}
                    </p>
                )}
            </div>

            {/* Status Messages */}
            {loading && (
                <div className="px-6 py-4 text-sm text-slate-400 flex items-center gap-2 shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Loading earthquake data…
                </div>
            )}
            {error && (
                <div className="mx-6 my-4 px-4 py-3 bg-red-950/30 border border-red-800/30 rounded-lg text-sm text-red-400 shrink-0">
                    {error}
                </div>
            )}

            {/* Filter */}
            {visible && (
                <select
                    className="m-5 mx-6 mb-4 px-3 py-2 bg-slate-900/50 text-slate-300 rounded-md border border-slate-700/30 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                    value={magByFilter}
                    onChange={(e) => setMagByFilter(e.target.value)}
                >
                    <option className="bg-slate-900" value="all">All Magnitudes</option>
                    <option className="bg-slate-900" value="minor">Minor (M &lt; 2.5)</option>
                    <option className="bg-slate-900" value="light">Light (2.5 &le; M &lt; 4.5)</option>
                    <option className="bg-slate-900" value="moderate">Moderate (4.5 &le; M &lt; 6.0)</option>
                    <option className="bg-slate-900" value="strong">Strong (6.0 &le; M &lt; 7.0)</option>
                    <option className="bg-slate-900" value="major">Major (M &ge; 7.0)</option>
                </select>
            )}

            {/* Earthquake List */}
            <ul className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700[&::-webkit-scrollbar-thumb]:rounded-full">
                {filteredEarthquakes.map((eq) => {
                    const { mag, place, time, magType } = eq.properties;

                    return (
                        <Tooltip key={eq.id} content={`${place} - ${new Date(time).toLocaleString()}`}>
                            <li className="group bg-slate-900/40 hover:bg-slate-800/60 rounded-xl p-4 transition-all duration-300 border border-slate-800/30 hover:border-slate-700/50 hover:shadow-lg hover:shadow-slate-900/50 hover:-translate-y-0.5">
                                <div className="flex items-start gap-4">
                                    <div
                                        onClick={() => focusOnEarthquake(eq.id, camera)}
                                        className={`w-14 h-14 rounded-xl bg-linear-to-br ${getMagnitudeStyle(mag)} flex items-center cursor-pointer justify-center font-bold text-lg shadow-lg transition-transform group-hover:scale-110`}
                                    >
                                        {mag !== null ? mag.toFixed(1) : '–'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-100 truncate group-hover:text-white transition-colors">
                                            {place || 'Unknown location'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1.5 font-medium">
                                            {new Date(time).toLocaleString()}
                                        </p>
                                        <div className="mt-2 flex items-center gap-3 text-xs">
                                            <span className="px-2 py-0.5 bg-slate-800/60 text-slate-400 rounded-md border border-slate-700/30">
                                                {magType ?? 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => {
                                            handleSaveEarthquake(eq.properties.detail, user?.id || '').then((result) => {
                                                if (result.success) {
                                                    if (result.message !== 'Earthquake saved successfully') {
                                                        triggerToast('Already saved! Choose another one.');
                                                    } else {
                                                        triggerToast('Earthquake saved!');
                                                    
                                                        if (result.data) {
                                                            addSavedEarthquake(result.data);
                                                        }
                                                    }
                                                } else {
                                                    triggerToast('Error saving earthquake.');
                                                }
                                            });
                                        }}
                                        className="hover:border-slate-700/50 hover:bg-slate-600/50 p-1 rounded-md transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        <Save className="w-5 h-5 text-slate-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </li>
                        </Tooltip>
                    );
                })}

                {!loading && earthquakes.length === 0 && (
                    <li className="px-6 py-12 text-center">
                        <div className="text-slate-600 text-4xl mb-3">🌍</div>
                        <p className="text-sm text-slate-500">No earthquakes detected</p>
                    </li>
                )}
            </ul>

            {/* Toast */}
            {toastMessage && (
                <div className="absolute left-1/2 top-5 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md shadow-lg z-50 pointer-events-none">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};