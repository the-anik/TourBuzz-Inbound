import React from 'react';
import { ShieldCheck, Plane, Smartphone, DollarSign, HeartHandshake, AlertCircle, Phone, Check } from 'lucide-react';

export const InboundGuideSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Intro Banner */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span>The Otithi Philosophy</span>
            <span aria-hidden="true">·</span>
            <span>Atithi Devo Bhava (The Guest is Sacred)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            International Traveler Essentials for Bangladesh
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In Bengali culture, an inbound visitor is an "Otithi"—someone to be protected, honored, and warmly embraced. Here is everything you need to know before touching down in Dhaka.
          </p>
        </div>
      </div>

      {/* 6 Essential Inbound Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Visa on Arrival */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <Plane className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">01. Visa on Arrival (VoA)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Citizens of the USA, UK, EU, Canada, Australia, Japan, and Singapore can obtain a 30-day Tourist Visa on Arrival at Hazrat Shahjalal International Airport (DAC) for approximately $51 USD. Bring cash USD and your TourBuzz booking voucher.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>TourBuzz provides official hotel booking proof</span>
          </div>
        </div>

        {/* 2. Airport Reception */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">02. VIP Airport Meet & Greet</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your TourBuzz driver and guide will await you inside the international arrival terminal holding an official name placard. We monitor live flight radar for delays to ensure seamless pickup.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Private air-conditioned transfer guaranteed</span>
          </div>
        </div>

        {/* 3. Connectivity & eSIM */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">03. Local eSIM & 4G Data</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Grameenphone and Robi airport booths provide instant tourist SIM cards with 20GB high-speed 4G data for under $8 USD. Your tour vehicle is also equipped with a satellite Wi-Fi hotspot.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Assistance with instant airport SIM activation</span>
          </div>
        </div>

        {/* 4. Currency & ATMs */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">04. Currency (BDT Taka) & Cash</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            While major hotels accept Visa and Mastercard, small artisans, tea stalls, and rickshaws operate strictly in cash Taka. We advise exchanging $100–$200 USD at the airport customs bank counters.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Fair official bank exchange rates</span>
          </div>
        </div>

        {/* 5. Cultural Etiquette */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">05. Cultural Etiquette & Attire</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            People in Bangladesh are extraordinarily welcoming and eager to chat. Modest attire covering shoulders and knees is appreciated, particularly when visiting historic mosques and Hindu temples.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Slip-on footwear recommended for heritage stops</span>
          </div>
        </div>

        {/* 6. Tourist Police Hotline */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">06. 24/7 Tourist Police Liaison</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bangladesh has a specialized Tourist Police branch dedicated exclusively to foreign travelers' security. Dial toll-free 999 or the direct helpline at +880 1320-001299 anytime.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>English-speaking emergency officers on duty</span>
          </div>
        </div>

      </div>

    </div>
  );
};
