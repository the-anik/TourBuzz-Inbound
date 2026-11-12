import React, { useState } from 'react';
import { TourPackage, LiveTourSession, TourBooking, TourCategory, TourAnnouncement } from '../types/tour';
import { Plus, Radio, Send, RefreshCw, CheckCircle, ShieldCheck, MapPin, Users, Calendar, AlertTriangle } from 'lucide-react';

interface OperatorDashboardProps {
  sessions: LiveTourSession[];
  packages: TourPackage[];
  bookings: TourBooking[];
  onUpdateSession: (updatedSession: LiveTourSession) => void;
  onAddPackage: (newPackage: TourPackage) => void;
  onAdvanceCheckpoint: (sessionId: string) => void;
  onPostAnnouncement: (sessionId: string, announcement: TourAnnouncement) => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  sessions,
  packages,
  bookings,
  onUpdateSession,
  onAddPackage,
  onAdvanceCheckpoint,
  onPostAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<'live_control' | 'add_package' | 'bookings'>('live_control');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  // Announcement State
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'checkpoint' | 'weather' | 'alert'>('info');
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // New Package State
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState<TourCategory>('eco_wildlife');
  const [newDays, setNewDays] = useState(2);
  const [newNights, setNewNights] = useState(1);
  const [newPriceUSD, setNewPriceUSD] = useState(280);
  const [newLocation, setNewLocation] = useState('');
  const [newDeparturePoint, setNewDeparturePoint] = useState('Dhaka City Center');
  const [newMaxGroup, setNewMaxGroup] = useState(8);
  const [newHighlights, setNewHighlights] = useState('UNESCO heritage site, Certified naturalist guide, All meals included');
  const [packageCreatedNotice, setPackageCreatedNotice] = useState(false);

  // Handle post announcement
  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim() || !activeSession) return;

    const newAnn: TourAnnouncement = {
      id: `ann-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: `${activeSession.guide.name} (Field Lead)`,
      message: announcementText.trim(),
      type: announcementType,
    };

    onPostAnnouncement(activeSession.id, newAnn);
    setAnnouncementText('');
    setAnnouncementSuccess(true);
    setTimeout(() => setAnnouncementSuccess(false), 3000);
  };

  // Handle Create Package
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdPkg: TourPackage = {
      id: `pkg-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle.trim(),
      tagline: newTagline.trim() || 'Curated authentic inbound experience by TourBuzz Live.',
      category: newCategory,
      durationDays: Number(newDays),
      durationNights: Number(newNights),
      priceUSD: Number(newPriceUSD),
      priceBDT: Number(newPriceUSD) * 121.5,
      rating: 5.0,
      reviewsCount: 1,
      location: newLocation.trim() || 'Bangladesh',
      departurePoint: newDeparturePoint.trim(),
      departureDates: ['2026-11-28', '2026-12-15'],
      image: '/src/assets/images/tour_ratargul_swamp_forest_1794499644047.jpg',
      featured: false,
      maxGroupSize: Number(newMaxGroup),
      difficulty: 'Moderate',
      foreignPermitRequired: true,
      guide: activeSession.guide,
      highlights: newHighlights.split(',').map((h) => h.trim()).filter(Boolean),
      itinerary: [
        {
          day: 1,
          title: 'Expedition Commencement',
          description: 'Meet guide at designated departure point. Private transfer and safety orientation.',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          stay: 'Boutique Eco Resort',
          activities: ['Orientation', 'Guided Exploration'],
        },
      ],
      inclusions: ['All meals and bottled water', 'Certified guide and logistics', 'Foreign tourist permits'],
      exclusions: ['International airfare', 'Gratuities'],
      packingAdvice: ['Sturdy shoes', 'Sun protection', 'Passport original'],
    };

    onAddPackage(createdPkg);
    setPackageCreatedNotice(true);
    setNewTitle('');
    setNewTagline('');
    setTimeout(() => setPackageCreatedNotice(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block">
            TourBuzz Live Operator & Guide Dispatcher Hub
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Tour Operator Control Center
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage live active tour GPS checkpoints, broadcast field updates to international tourists, and register inbound itineraries.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('live_control')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'live_control' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Live Tour Control
          </button>
          <button
            onClick={() => setActiveTab('add_package')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'add_package' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Add Package
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bookings' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Tourist Manifest ({bookings.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Live Tour Dispatcher Control */}
      {activeTab === 'live_control' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Active session selection & controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Session Selector */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Active Tour to Dispatch
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSessionId(s.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeSession?.id === s.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono font-bold text-emerald-400">
                      {s.trackingCode}
                    </div>
                    <div className="text-xs font-bold truncate mt-0.5">{s.tourTitle}</div>
                    <div className="text-[10px] text-slate-300 mt-1">{s.statusLabel}</div>
                  </button>
                ))}
              </div>

              {activeSession && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Current Checkpoint</span>
                    <strong className="text-slate-900">{activeSession.currentCheckpoint}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Vehicle & Reg</span>
                    <strong className="text-slate-900">{activeSession.vehicleType} ({activeSession.vehicleReg})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Speed</span>
                    <strong className="font-mono text-slate-900">{activeSession.speedKmh} km/h</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Checkpoint Advancement & Status Control */}
            {activeSession && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Route Waypoint Controller
                  </h3>
                  <button
                    onClick={() => onAdvanceCheckpoint(activeSession.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Advance to Next Checkpoint</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {activeSession.routeWaypoints.map((wp, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        wp.passed
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          wp.passed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {i + 1}
                        </span>
                        <div>
                          <strong className="block">{wp.name}</strong>
                          <span className="text-[10px] text-slate-400">{wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}</span>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold font-mono">
                        {wp.passed ? '✓ Cleared' : (wp.eta ? `ETA ${wp.eta}` : 'Scheduled')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right: Broadcast Real-Time Announcement (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">
                  Broadcast Field Announcement to Tourists
                </h3>
              </div>

              <p className="text-xs text-slate-500">
                Pushes a live realtime broadcast message to the traveler's screen and their tracking dashboard.
              </p>

              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Announcement Category
                  </label>
                  <select
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="checkpoint">Checkpoint & Activity Update</option>
                    <option value="info">General Group Information</option>
                    <option value="weather">Weather & River Tide Update</option>
                    <option value="alert">Safety Alert / Assembly Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message Content
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="e.g. All rowboats safely returned from Jamtola canal. Lunch will be served on the sundeck at 1:00 PM."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white resize-none"
                  />
                </div>

                {announcementSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Announcement broadcasted successfully to all travelers!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Realtime Broadcast</span>
                </button>
              </form>
            </div>

            {/* Quick Field Status Switcher */}
            {activeSession && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
                <span className="font-bold text-slate-900 block">Quick Tour Status Toggles</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Safari Active', status: 'safari_active' as const, labelText: 'Canoe / Forest Safari in Progress' },
                    { label: 'En Route', status: 'en_route' as const, labelText: 'Transit En Route on Highway' },
                    { label: 'Checkpoint Stop', status: 'checkpoint_stop' as const, labelText: 'Stationary Checkpoint Visit' },
                    { label: 'Meal Break', status: 'break' as const, labelText: 'Rest / Meal Break' },
                  ].map((item) => (
                    <button
                      key={item.status}
                      onClick={() => {
                        onUpdateSession({
                          ...activeSession,
                          status: item.status,
                          statusLabel: item.labelText,
                        });
                      }}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        activeSession.status === item.status
                          ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Tab 2: Add New Tour Package */}
      {activeTab === 'add_package' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Add New Inbound Tour Itinerary</h3>
            <p className="text-xs text-slate-500 mt-1">
              Publish an attractive new tour package for foreign travelers with verified itinerary specs and PDF download capability.
            </p>
          </div>

          {packageCreatedNotice && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>New tour package created and published to catalog with PDF generator ready!</span>
            </div>
          )}

          <form onSubmit={handleCreatePackage} className="space-y-5 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tour Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chittagong Ship Breaking Yard & Maritime Odyssey"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline / Brief Summary
                </label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="e.g. World famous maritime salvage history, local fish markets and coastal trails."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TourCategory)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                >
                  <option value="eco_wildlife">Eco & Wildlife</option>
                  <option value="heritage">Living Heritage</option>
                  <option value="tea_highlands">Tea Highlands</option>
                  <option value="river_marine">River & Marine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location / Region
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Chittagong Coast"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={newDays}
                  onChange={(e) => setNewDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration Nights
                </label>
                <input
                  type="number"
                  min="0"
                  max="14"
                  value={newNights}
                  onChange={(e) => setNewNights(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Price in USD ($) *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  value={newPriceUSD}
                  onChange={(e) => setNewPriceUSD(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Group Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={newMaxGroup}
                  onChange={(e) => setNewMaxGroup(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  value={newHighlights}
                  onChange={(e) => setNewHighlights(e.target.value)}
                  placeholder="Mughal architecture, Local artisan demonstration, Private boat charter"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Publish Package
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Tourist Manifest */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inbound Tourist Manifest & Permit Database
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Government Forest & Tourist Police clearance registry for international travelers.
              </p>
            </div>

            <span className="text-xs font-semibold font-mono bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">
              {bookings.length} Registered Bookings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Tracking Code</th>
                  <th className="py-3.5 px-4">Lead Guest</th>
                  <th className="py-3.5 px-4">Passport No</th>
                  <th className="py-3.5 px-4">Nationality</th>
                  <th className="py-3.5 px-4">Tour</th>
                  <th className="py-3.5 px-4">Departure</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {booking.bookingCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {booking.leadGuestName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {booking.passportNumber}
                    </td>
                    <td className="py-3 px-4">
                      {booking.nationality}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 truncate max-w-xs">
                      {booking.tourTitle}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {booking.departureDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Permit Issued
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
