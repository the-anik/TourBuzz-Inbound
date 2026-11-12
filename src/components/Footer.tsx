import React from 'react';
import { Compass, ShieldCheck, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: 'tours' | 'tracking' | 'guide' | 'operator') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                TourBuzz <span className="text-emerald-400">Live</span>
              </span>
            </div>

            <p className="text-slate-400 max-w-sm leading-relaxed">
              Premium inbound tourism operator certified by the Bangladesh Tourism Board. Empowering foreign travelers with transparent itineraries, instant downloadable PDF documents, and live real-time tour GPS telemetry.
            </p>

            <div className="text-[11px] text-slate-500">
              License No: <span className="font-mono text-slate-300">BTB-OPR-2026-904</span> · Ministry of Civil Aviation and Tourism
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Explore Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavClick('tours')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curated Tour Itineraries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('tracking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live GPS Tour Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('guide')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inbound Traveler Essentials (Otithi)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('operator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Operator & Guide Dispatcher Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              24/7 Foreign Tourist Support
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tourist Police Emergency Dispatch:
            </p>
            <div className="space-y-1 font-mono text-slate-200">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+880 1320-001299</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <span>inbound@tourbuzzlive.com</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 pt-1">
              Hazrat Shahjalal International Airport Arrival Desk: Terminal 2 Counter 14
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} TourBuzz Live. All rights reserved. Built for international inbound tourism.
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Tourist Police Charter</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
