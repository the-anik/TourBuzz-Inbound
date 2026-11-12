import React from 'react';
import { CurrencyCode } from '../types/tour';
import { Globe, Radio, Compass, ShieldCheck, MapPin } from 'lucide-react';

interface NavbarProps {
  activeTab: 'tours' | 'tracking' | 'guide' | 'operator';
  setActiveTab: (tab: 'tours' | 'tracking' | 'guide' | 'operator') => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  onBookClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onBookClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('tours')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            aria-label="TourBuzz Live Home"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                TourBuzz <span className="text-emerald-600">Live</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block -mt-0.5">
                Inbound Expeditions
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('tours')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeTab === 'tours'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Tour Packages
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-2 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeTab === 'tracking'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Live GPS Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Traveler Essentials (Otithi)
            </button>

            <button
              onClick={() => setActiveTab('operator')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                activeTab === 'operator'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Operator Hub
            </button>
          </nav>

          {/* Zone 3: 1 primary action + Currency selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Currency selector */}
            <div className="relative inline-flex items-center">
              <label htmlFor="currency-select" className="sr-only">Select Currency</label>
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="pl-7 pr-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border-0 rounded-lg text-slate-700 cursor-pointer focus:ring-2 focus:ring-slate-900 transition-colors"
                aria-label="Currency Selector"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>

            <button
              onClick={onBookClick}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              Book Inbound Tour
            </button>
          </div>

        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-100 py-2.5 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'tours' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Tours
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tracking' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            <Radio className="w-3 h-3" />
            Live Tracking
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'guide' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Traveler Essentials
          </button>
          <button
            onClick={() => setActiveTab('operator')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'operator' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Operator Hub
          </button>
        </div>

      </div>
    </header>
  );
};
