import React from 'react';
import { TourPackage, CurrencyCode } from '../types/tour';
import { formatPrice } from '../utils/pricing';
import { generateTourPackagePDF } from '../utils/pdfGenerator';
import { FileDown, Calendar, Users, Star, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface PackageCardProps {
  tour: TourPackage;
  currency: CurrencyCode;
  onSelect: (tour: TourPackage) => void;
  onBook: (tour: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  tour,
  currency,
  onSelect,
  onBook,
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      generateTourPackagePDF(tour, currency);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div
      onClick={() => onSelect(tour)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Visual Asset Frame */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={tour.image}
          alt={tour.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Styled graceful fallback container if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Clean subtle location label */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
          {tour.location}
        </div>

        {tour.foreignPermitRequired && (
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Permit Included</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>{tour.durationDays}D / {tour.durationNights}N</span>
            <span aria-hidden="true">·</span>
            <span>Max {tour.maxGroupSize} Guests</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{tour.rating.toFixed(2)}</span>
              <span className="text-slate-400">({tour.reviewsCount})</span>
            </span>
          </div>

          {/* Title & Tagline */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
            {tour.title}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {tour.tagline}
          </p>

          {/* Highlights checklist */}
          <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
            {tour.highlights.slice(0, 2).map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span className="line-clamp-1">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Actions Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">All-Inclusive Price</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatPrice(tour.priceUSD, currency)}
              <span className="text-xs font-normal text-slate-500 ml-1 font-sans">/ traveler</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Download Itinerary PDF button */}
            <button
              onClick={handleDownloadPDF}
              title="Download Itinerary PDF"
              aria-label={`Download Itinerary PDF for ${tour.title}`}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <FileDown className={`w-4 h-4 ${downloading ? 'animate-bounce text-emerald-600' : ''}`} />
            </button>

            {/* View Details / Book */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(tour);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              Book Tour
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
