import React, { useEffect, useRef, useState } from 'react';
import { LiveTourSession } from '../types/tour';
import { calculateRouteProgress } from '../utils/tourRules';
import L from 'leaflet';
import { Radio, Search, ShieldAlert, Phone, Battery, Wifi, Navigation, Clock, MessageSquare, AlertCircle, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

interface LiveTrackingViewProps {
  sessions: LiveTourSession[];
  selectedCode?: string;
  onSelectSession: (session: LiveTourSession) => void;
  onSosTriggered?: (session: LiveTourSession) => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  sessions,
  selectedCode,
  onSelectSession,
  onSosTriggered,
}) => {
  const [searchInput, setSearchInput] = useState(selectedCode || sessions[0]?.trackingCode || 'TB-7721');
  const [activeSession, setActiveSession] = useState<LiveTourSession>(() => {
    if (selectedCode) {
      const match = sessions.find((s) => s.trackingCode.toLowerCase() === selectedCode.toLowerCase());
      if (match) return match;
    }
    return sessions[0];
  });

  const [sosSent, setSosSent] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Sync when selectedCode prop changes
  useEffect(() => {
    if (selectedCode) {
      const match = sessions.find((s) => s.trackingCode.toLowerCase() === selectedCode.toLowerCase());
      if (match) {
        setActiveSession(match);
        setSearchInput(match.trackingCode);
      }
    }
  }, [selectedCode, sessions]);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    const match = sessions.find((s) => s.trackingCode.toLowerCase() === query || s.tourTitle.toLowerCase().includes(query));
    if (match) {
      setActiveSession(match);
      onSelectSession(match);
    }
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([activeSession.currentCoords.lat, activeSession.currentCoords.lng], 10);

      // High-contrast clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();

    // Draw route polyline
    const latlngs: L.LatLngExpression[] = activeSession.routeWaypoints.map((w) => [w.lat, w.lng]);
    const routeLine = L.polyline(latlngs, {
      color: '#0f172a',
      weight: 3.5,
      opacity: 0.8,
      dashArray: '6, 8',
    });
    markers.addLayer(routeLine);

    // Add waypoint markers
    activeSession.routeWaypoints.forEach((wp, index) => {
      const isPassed = wp.passed;
      const markerColor = isPassed ? '#059669' : '#64748b'; // emerald or slate
      const wpIcon = L.divIcon({
        className: 'custom-waypoint-icon',
        html: `
          <div style="
            width: 22px; 
            height: 22px; 
            background: ${markerColor}; 
            border: 2px solid #ffffff; 
            border-radius: 50%; 
            color: #ffffff; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 10px; 
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.25);
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: wpIcon });
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #0f172a;">${wp.name}</strong><br/>
          <span style="color: ${isPassed ? '#059669' : '#64748b'}; font-weight: 600;">
            ${isPassed ? '✓ Passed Checkpoint' : `Upcoming (ETA: ${wp.eta || 'Scheduled'})`}
          </span>
          ${wp.description ? `<p style="margin: 4px 0 0 0; color: #475569;">${wp.description}</p>` : ''}
        </div>
      `);
      markers.addLayer(marker);
    });

    // Add Live Vehicle position marker with pulsing radar animation
    const vehicleIcon = L.divIcon({
      className: 'vehicle-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div class="radar-pulse" style="
            position: absolute;
            inset: -8px;
            background: rgba(16, 185, 129, 0.4);
            border-radius: 50%;
          "></div>
          <div style="
            width: 32px;
            height: 32px;
            background: #0f172a;
            border: 2.5px solid #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            color: #10b981;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const liveMarker = L.marker([activeSession.currentCoords.lat, activeSession.currentCoords.lng], {
      icon: vehicleIcon,
      zIndexOffset: 1000,
    });

    liveMarker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.4; min-width: 180px;">
        <span style="color: #059669; font-weight: bold; text-transform: uppercase; font-size: 10px;">● Live Position</span>
        <h4 style="margin: 2px 0; font-size: 13px; color: #0f172a;">${activeSession.tourTitle}</h4>
        <div style="color: #475569; font-size: 11px;">
          Vehicle: ${activeSession.vehicleType} (${activeSession.vehicleReg})<br/>
          Speed: <strong>${activeSession.speedKmh} km/h</strong><br/>
          Lead Guide: ${activeSession.guide.name}
        </div>
      </div>
    `);

    markers.addLayer(liveMarker);

    // Pan map to current live position
    map.flyTo([activeSession.currentCoords.lat, activeSession.currentCoords.lng], 10, {
      duration: 1.2,
    });

  }, [activeSession]);

  const progressPercent = calculateRouteProgress(activeSession.routeWaypoints);

  const handleTriggerSOS = () => {
    setSosSent(true);
    if (onSosTriggered) {
      onSosTriggered(activeSession);
    }
    setTimeout(() => setSosSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Bar: Search by tracking code + Demo Selectors */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>Supabase Realtime GPS Synchronization Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Live Tour Telemetry & Location Monitor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time coordinates and checkpoint verification for active inbound expeditions across Bangladesh.
          </p>
        </div>

        {/* Search Code Form */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter code (e.g. TB-7721)..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 uppercase focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </form>

          <button
            onClick={handleSearch}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Track Code
          </button>
        </div>

      </div>

      {/* Active Session Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0 text-[10px]">
          Active Tours:
        </span>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => {
              setActiveSession(session);
              setSearchInput(session.trackingCode);
              onSelectSession(session);
            }}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeSession.id === session.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="font-mono font-bold text-emerald-400">{session.trackingCode}</span>
            <span>{session.tourTitle}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Map + Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Leaflet Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-3">
            <div className="relative w-full h-[450px] sm:h-[520px] rounded-xl overflow-hidden border border-slate-100">
              <div ref={mapContainerRef} className="w-full h-full" />
              
              {/* Map Floating Status Card */}
              <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-lg max-w-xs">
                <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 mb-1">
                  <span>Tracking Ref: <strong className="font-mono text-white">{activeSession.trackingCode}</strong></span>
                  <span className="text-emerald-400 font-semibold">{activeSession.signalQuality}</span>
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{activeSession.statusLabel}</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Currently at: <span className="font-medium text-emerald-300">{activeSession.currentCheckpoint}</span>
                </div>
              </div>

              {/* Map Controls Helper */}
              <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] shadow-md flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-slate-900" />
                <span>Speed: <strong className="font-mono">{activeSession.speedKmh} km/h</strong></span>
                <span className="text-slate-300">|</span>
                <span>Battery: <strong className="font-mono">{activeSession.batteryLevel}%</strong></span>
              </div>
            </div>
          </div>

          {/* Route Waypoints Progression Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Itinerary Checkpoint Progress ({progressPercent}% Completed)
              </h3>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                {activeSession.routeWaypoints.filter(w => w.passed).length} of {activeSession.routeWaypoints.length} Cleared
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-6">
              <div
                className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checkpoint list */}
            <div className="space-y-3">
              {activeSession.routeWaypoints.map((wp, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 p-3 rounded-xl border text-xs transition-colors ${
                    wp.passed
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {wp.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">{wp.name}</span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        {wp.passed ? 'Cleared' : (wp.eta ? `ETA: ${wp.eta}` : 'Scheduled')}
                      </span>
                    </div>
                    {wp.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{wp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Live Telemetry, Lead Guide, Announcements & SOS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Status & Telemetry Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  Assigned Vehicle & Transit
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeSession.vehicleType}
                </h4>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Registration: {activeSession.vehicleReg}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Next Destination</span>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{activeSession.nextCheckpoint}</div>
                <div className="text-xs text-emerald-700 font-semibold mt-0.5">{activeSession.etaNextCheckpoint}</div>
              </div>
            </div>

            {/* Certified Lead Guide Card */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Certified Inbound Tour Leader
              </span>

              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <img
                  src={activeSession.guide.photoUrl}
                  alt={activeSession.guide.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {activeSession.guide.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Govt License: <span className="font-mono">{activeSession.guide.licenseNumber}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Languages: {activeSession.guide.languages.join(', ')}
                  </div>
                </div>

                <a
                  href={`tel:${activeSession.guide.phone}`}
                  className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0 shadow-sm"
                  aria-label="Call Lead Guide"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Live Operator Broadcast Stream */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Field Broadcasts & Announcements
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Live Stream</span>
            </div>

            <div className="space-y-3">
              {activeSession.announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-slate-700">{ann.author}</span>
                    <span className="font-mono">{ann.timestamp}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {ann.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 24/7 Tourist Police Emergency & SOS Hotline */}
          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  National Tourist Security Protocol
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  Tourist Police & Emergency Liaison
                </h4>
              </div>

              <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/30">
                24/7 Live
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Every TourBuzz Live party is logged with the Bangladesh Tourist Police headquarters. If assistance is required at any checkpoint, dial directly or trigger the rapid SOS broadcast.
            </p>

            <div className="space-y-2 text-xs">
              {activeSession.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{contact.title}</div>
                    <div className="text-[11px] text-slate-400">{contact.role}</div>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs rounded-md transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>

            {/* Trigger SOS Ping */}
            <div className="pt-2">
              <button
                onClick={handleTriggerSOS}
                disabled={sosSent}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  sosSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {sosSent ? '✓ Emergency SOS Ping Sent to Control Desk!' : 'Send Rapid SOS Ping to TourBuzz Dispatch'}
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
