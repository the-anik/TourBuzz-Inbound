import React, { useState, useMemo } from 'react';
import { TourPackage, LiveTourSession, TourBooking, TourCategory, CurrencyCode, TourAnnouncement } from './types/tour';
import { INITIAL_TOURS } from './data/toursData';
import { INITIAL_LIVE_SESSIONS } from './data/liveToursData';
import { filterTourPackages } from './utils/tourRules';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PackageCard } from './components/PackageCard';
import { PackageModal } from './components/PackageModal';
import { BookingModal } from './components/BookingModal';
import { LiveTrackingView } from './components/LiveTrackingView';
import { OperatorDashboard } from './components/OperatorDashboard';
import { InboundGuideSection } from './components/InboundGuideSection';
import { Footer } from './components/Footer';
import { Compass, Radio, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tours' | 'tracking' | 'guide' | 'operator'>('tours');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TourCategory>('all');

  // Application Data States
  const [packages, setPackages] = useState<TourPackage[]>(INITIAL_TOURS);
  const [sessions, setSessions] = useState<LiveTourSession[]>(INITIAL_LIVE_SESSIONS);
  const [bookings, setBookings] = useState<TourBooking[]>([
    {
      id: 'book-seed-01',
      bookingCode: 'TB-7721',
      tourId: 'pkg-sundarbans-01',
      tourTitle: 'Sundarbans Wild Mangrove Expedition',
      departureDate: '2026-11-20',
      guestCount: 2,
      leadGuestName: 'Julian & Claire Mercer',
      passportNumber: 'US892184910',
      nationality: 'United States',
      email: 'julian.mercer@example.com',
      phone: '+1 415-882-9011',
      totalAmountUSD: 840,
      currency: 'USD',
      convertedAmount: 840,
      status: 'active_today',
      createdAt: '2026-11-05T09:30:00Z',
    },
    {
      id: 'book-seed-02',
      bookingCode: 'TB-8492',
      tourId: 'pkg-dhaka-02',
      tourTitle: 'Old Dhaka Living Heritage & Artisan Trail',
      departureDate: '2026-11-14',
      guestCount: 1,
      leadGuestName: 'Hiroshi Tanaka',
      passportNumber: 'JP448291039',
      nationality: 'Japan',
      email: 'tanaka.h@example.co.jp',
      phone: '+81 90-1234-5678',
      totalAmountUSD: 85,
      currency: 'USD',
      convertedAmount: 85,
      status: 'active_today',
      createdAt: '2026-11-10T14:15:00Z',
    },
    {
      id: 'book-seed-03',
      bookingCode: 'TB-9104',
      tourId: 'pkg-sreemangal-03',
      tourTitle: 'Sreemangal Tea Estates & Rainforest Escape',
      departureDate: '2026-11-22',
      guestCount: 2,
      leadGuestName: 'Sophie Van Der Berg',
      passportNumber: 'NL992384102',
      nationality: 'Netherlands',
      email: 'sophie.vdb@example.nl',
      phone: '+31 6 12345678',
      totalAmountUSD: 720,
      currency: 'USD',
      convertedAmount: 720,
      status: 'confirmed',
      createdAt: '2026-11-11T16:00:00Z',
    },
  ]);

  // Modals
  const [selectedTourForModal, setSelectedTourForModal] = useState<TourPackage | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [tourForBooking, setTourForBooking] = useState<TourPackage | null>(null);

  // Active tracking code deep link
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('TB-7721');

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return filterTourPackages(packages, selectedCategory, searchQuery);
  }, [packages, selectedCategory, searchQuery]);

  // Handlers
  const handleOpenTourDetails = (tour: TourPackage) => {
    setSelectedTourForModal(tour);
  };

  const handleStartBooking = (tour?: TourPackage) => {
    setTourForBooking(tour || packages[0]);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: TourBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setActiveTrackingCode(newBooking.bookingCode);
  };

  const handleTrackCode = (code: string) => {
    setActiveTrackingCode(code);
    setActiveTab('tracking');
  };

  // Operator Actions
  const handleAdvanceCheckpoint = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        // Find next unpassed waypoint
        const unpassedIndex = s.routeWaypoints.findIndex((w) => !w.passed);
        if (unpassedIndex === -1) return s;

        const updatedWaypoints = [...s.routeWaypoints];
        updatedWaypoints[unpassedIndex] = { ...updatedWaypoints[unpassedIndex], passed: true };

        const currentWp = updatedWaypoints[unpassedIndex];
        const nextWp = updatedWaypoints[unpassedIndex + 1];

        // Automatic announcement
        const checkpointAnn: TourAnnouncement = {
          id: `ann-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: `${s.guide.name} (Field Lead)`,
          message: `Arrived and cleared checkpoint: ${currentWp.name}. All travelers accounted for.`,
          type: 'checkpoint',
        };

        return {
          ...s,
          routeWaypoints: updatedWaypoints,
          currentCheckpoint: currentWp.name,
          nextCheckpoint: nextWp ? nextWp.name : 'Tour Conclusion Point',
          etaNextCheckpoint: nextWp ? 'Next Stop (approx 45 mins)' : 'Completed',
          currentCoords: {
            lat: currentWp.lat,
            lng: currentWp.lng,
          },
          announcements: [checkpointAnn, ...s.announcements],
        };
      })
    );
  };

  const handlePostAnnouncement = (sessionId: string, announcement: TourAnnouncement) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          announcements: [announcement, ...s.announcements],
        };
      })
    );
  };

  const handleUpdateSession = (updatedSession: LiveTourSession) => {
    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
  };

  const handleAddPackage = (newPkg: TourPackage) => {
    setPackages((prev) => [newPkg, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 3-Zone Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onBookClick={() => handleStartBooking()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* TAB 1: Tour Packages Explorer */}
        {activeTab === 'tours' && (
          <div>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onExploreClick={() => {
                const el = document.getElementById('packages-catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onLiveTrackingClick={() => setActiveTab('tracking')}
            />

            {/* Packages Catalog Section */}
            <section id="packages-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <span>Curated Inbound Expeditions</span>
                    <span aria-hidden="true">·</span>
                    <span>All-Inclusive Traveler Pricing</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Featured Itineraries for International Travelers
                  </h2>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Showing <strong className="text-slate-900">{filteredPackages.length}</strong> available package{filteredPackages.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Package Cards Grid */}
              {filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPackages.map((tour) => (
                    <PackageCard
                      key={tour.id}
                      tour={tour}
                      currency={currency}
                      onSelect={handleOpenTourDetails}
                      onBook={(t) => handleStartBooking(t)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
                  <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900">No matching itineraries found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try resetting your search query or selecting "All Itineraries".</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Inbound Otithi Philosophy Feature Banner */}
              <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>The Otithi Trust Architecture</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Traveling with TourBuzz Live means never being on your own.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    From pre-cleared forest permits and airport reception to 24/7 tourist police liaison and family GPS tracking, every detail is engineered so you can immerse yourself in Bangladesh with absolute peace of mind.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => setActiveTab('guide')}
                    className="px-5 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow text-center cursor-pointer"
                  >
                    Read Traveler Essentials
                  </button>
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className="px-5 py-3 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors text-center cursor-pointer"
                  >
                    View Live GPS Map
                  </button>
                </div>
              </div>

            </section>
          </div>
        )}

        {/* TAB 2: Live GPS Tracking View */}
        {activeTab === 'tracking' && (
          <LiveTrackingView
            sessions={sessions}
            selectedCode={activeTrackingCode}
            onSelectSession={(s) => setActiveTrackingCode(s.trackingCode)}
            onSosTriggered={(s) => {
              // Add alert announcement
              const sosAnn: TourAnnouncement = {
                id: `ann-sos-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                author: 'Emergency SOS Relay',
                message: `Tourist SOS Beacon acknowledged for tour ${s.trackingCode}. Tourist Police Unit notified.`,
                type: 'alert',
              };
              handlePostAnnouncement(s.id, sosAnn);
            }}
          />
        )}

        {/* TAB 3: Inbound Traveler Essentials Guide */}
        {activeTab === 'guide' && <InboundGuideSection />}

        {/* TAB 4: Tour Operator & Dispatcher Dashboard */}
        {activeTab === 'operator' && (
          <OperatorDashboard
            sessions={sessions}
            packages={packages}
            bookings={bookings}
            onUpdateSession={handleUpdateSession}
            onAddPackage={handleAddPackage}
            onAdvanceCheckpoint={handleAdvanceCheckpoint}
            onPostAnnouncement={handlePostAnnouncement}
          />
        )}

      </main>

      {/* Package Details Modal with Tabs & PDF Download */}
      <PackageModal
        tour={selectedTourForModal}
        currency={currency}
        onClose={() => setSelectedTourForModal(null)}
        onBook={(tour) => {
          setSelectedTourForModal(null);
          handleStartBooking(tour);
        }}
      />

      {/* Booking Checkout Modal */}
      <BookingModal
        tour={tourForBooking}
        tours={packages}
        currency={currency}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
        onTrackTour={handleTrackCode}
      />

      {/* Clean Footer */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />

    </div>
  );
}
