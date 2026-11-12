import React from 'react';
import { TourPackage, CurrencyCode } from '../types/tour';
import { formatPrice } from '../utils/pricing';
import { generateTourPackagePDF } from '../utils/pdfGenerator';
import { X, FileDown, ShieldCheck, Check, Star, Calendar, Users, MapPin, AlertCircle, Phone, ArrowRight } from 'lucide-react';

interface PackageModalProps {
  tour: TourPackage | null;
  currency: CurrencyCode;
  onClose: () => void;
  onBook: (tour: TourPackage) => void;
}

export const PackageModal: React.FC<PackageModalProps> = ({
  tour,
  currency,
  onClose,
  onBook,
}) => {
  const [activeTab, setActiveTab] = React.useState<'itinerary' | 'inclusions' | 'guide' | 'permits'>('itinerary');
  const [downloading, setDownloading] = React.useState(false);

  if (!tour) return null;

  const handleDownload = () => {
    setDownloading(true);
    try {
      generateTourPackagePDF(tour, currency);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* Top Header Visual */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={tour.image}
            alt={tour.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-between">
            {/* Close & Download button row */}
            <div className="flex items-center justify-between">
              <div className="bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-semibold px-3 py-1 rounded-md border border-slate-700">
                {tour.location}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  aria-label="Download Official Itinerary PDF"
                >
                  <FileDown className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce text-emerald-600' : ''}`} />
                  <span>{downloading ? 'Preparing PDF...' : 'Download PDF'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 text-white/80 hover:text-white bg-slate-900/70 hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
                  aria-label="Close details modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title & Key Specs */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
                <span aria-hidden="true">·</span>
                <span>Max {tour.maxGroupSize} Guests</span>
                <span aria-hidden="true">·</span>
                <span>Difficulty: {tour.difficulty}</span>
              </div>
              <h2 id="modal-title" className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
                {tour.title}
              </h2>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-6 flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 overflow-x-auto shrink-0 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'itinerary'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Daily Itinerary
          </button>
          <button
            onClick={() => setActiveTab('inclusions')}
            className={`py-3 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'inclusions'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            What's Included & Packing
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Lead Naturalist & Guide
          </button>
          <button
            onClick={() => setActiveTab('permits')}
            className={`py-3 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'permits'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Foreign Permits & Safety
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          
          {/* Tab 1: Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Day {day.day}
                      </span>
                      <span className="text-xs text-slate-500">Overnight: {day.stay}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {day.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {day.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <div>
                        <span className="font-semibold text-slate-700">Meals Included:</span> {day.meals.join(', ')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {day.activities.map((act, i) => (
                          <span key={i} className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Expedition Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-100/60">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Inclusions & Packing */}
          {activeTab === 'inclusions' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Exclusions
                  </h4>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-500">
                        <span className="text-slate-400 font-bold shrink-0">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Foreign Traveler Packing Checklist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tour.packingAdvice.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Guide Profile */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-md">
                  <img
                    src={tour.guide.photoUrl}
                    alt={tour.guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{tour.guide.name}</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Govt Licensed Lead
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    License ID: <span className="font-mono">{tour.guide.licenseNumber}</span> · {tour.guide.experienceYears} Years Field Experience
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-700">Languages:</span> {tour.guide.languages.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Rating:</span> {tour.guide.rating.toFixed(2)} / 5.0
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center sm:justify-start gap-3">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {tour.guide.phone}
                    </span>
                    <span className="text-xs text-slate-400">· Available via WhatsApp</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed border border-slate-100">
                All TourBuzz Live tour leaders are certified naturalists and cultural historians vetted by the Bangladesh Tourism Board. They hold wilderness first aid credentials and carry emergency satellite communicators when in deep mangrove or highland reserves.
              </div>
            </div>
          )}

          {/* Tab 4: Permits & Safety */}
          {activeTab === 'permits' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Foreign Tourist Permit Clearances Handled For You
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  International travelers visiting restricted zones (Sundarbans Tiger Reserve, border tribal areas, or maritime sanctuaries) require Forest Department and Home Ministry passes. TourBuzz Live handles 100% of the paperwork using your passport registration upon booking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h5 className="font-bold text-slate-900 mb-1">Tourist Police Escort & Liaison</h5>
                  <p className="text-slate-600 leading-relaxed">
                    Bangladesh Tourist Police operates 24/7 dedicated control desks across Dhaka, Khulna, Sylhet, and Cox's Bazar. Tour manifests are synchronized for tourist protection.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h5 className="font-bold text-slate-900 mb-1">Live Family Tracking Link</h5>
                  <p className="text-slate-600 leading-relaxed">
                    After booking, you and your family will receive a unique tracking reference code (e.g. TB-7721) to follow the tour group's live checkpoints and daily progress in real-time.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Total Price per Traveler</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatPrice(tour.priceUSD, currency)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBook(tour);
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Book This Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
