import React from 'react';
import { TourCategory } from '../types/tour';
import { Search, Compass, ShieldCheck, Radio, FileText, ArrowRight } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: TourCategory;
  setSelectedCategory: (c: TourCategory) => void;
  onExploreClick: () => void;
  onLiveTrackingClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onExploreClick,
  onLiveTrackingClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      
      {/* Hero Visual & Headline Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Proposition & Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>Otithi Inbound Hospitality</span>
              <span aria-hidden="true">·</span>
              <span>Bangladesh Tourism Board Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Authentic Inbound Travel with Live Tour Tracking
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Curated expeditions for international travelers across Bangladesh—from ancient Mughal waterways to UNESCO mangrove wilderness. Every expedition features licensed naturalist guides, instant downloadable PDF travel dossiers, and real-time live GPS telemetry for traveler peace of mind.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span>View Curated Packages</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLiveTrackingClick}
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Track Ongoing Tour Live</span>
              </button>
            </div>

            {/* Interactive Package Search & Filter Bar */}
            <div className="pt-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by destination (e.g. Sundarbans, Old Dhaka, Sreemangal tea)..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* Segmented Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3">
                <span className="text-xs font-semibold text-slate-400 mr-2">Filter by:</span>
                {[
                  { id: 'all', label: 'All Itineraries' },
                  { id: 'eco_wildlife', label: 'Eco & Wildlife' },
                  { id: 'heritage', label: 'Living Heritage' },
                  { id: 'tea_highlands', label: 'Tea Highlands' },
                  { id: 'river_marine', label: 'River & Marine' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as TourCategory)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset (16:9) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group">
              <img
                src="/src/assets/images/hero_sundarbans_tour_1794499643113.jpg"
                alt="Sundarbans mangrove river expedition boat in morning mist"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Tour #TB-7721 Active Now</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Sundarbans Mangrove Expedition
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Cruising through Kotka Wildlife Sanctuary · Lead Naturalist: Tanvir Hossain
                </p>
                <div className="pt-3">
                  <button
                    onClick={onLiveTrackingClick}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Watch Live Telemetry →
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4-Column KPI Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Otithi Hospitality</div>
            <div className="text-base font-bold text-slate-900 mt-1">100% Certified Guides</div>
            <div className="text-xs text-slate-600 mt-0.5">Licensed by Bangladesh Tourism Board</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Real-Time Safety</div>
            <div className="text-base font-bold text-slate-900 mt-1">Live GPS Telemetry</div>
            <div className="text-xs text-slate-600 mt-0.5">Shared tracking codes for families</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inbound Logistics</div>
            <div className="text-base font-bold text-slate-900 mt-1">Pre-cleared Permits</div>
            <div className="text-xs text-slate-600 mt-0.5">Forest, marine & heritage clearance</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emergency Liaison</div>
            <div className="text-base font-bold text-slate-900 mt-1">Tourist Police 24/7</div>
            <div className="text-xs text-slate-600 mt-0.5">Direct emergency hotline integration</div>
          </div>
        </div>

      </div>

    </section>
  );
};
