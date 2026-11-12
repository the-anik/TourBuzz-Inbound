import React, { useState } from 'react';
import { TourPackage, TourBooking, CurrencyCode } from '../types/tour';
import { formatPrice, calculateBookingTotal } from '../utils/pricing';
import { validatePassportNumber, generateTrackingCode } from '../utils/tourRules';
import { generateBookingVoucherPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, CheckCircle2, FileDown, Radio, User, Mail, Phone, FileText, Globe } from 'lucide-react';

interface BookingModalProps {
  tour: TourPackage | null;
  tours: TourPackage[];
  currency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (booking: TourBooking) => void;
  onTrackTour: (code: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  tour,
  tours,
  currency,
  isOpen,
  onClose,
  onBookingConfirmed,
  onTrackTour,
}) => {
  const [selectedTourId, setSelectedTourId] = useState<string>(tour?.id || tours[0]?.id || '');
  const activeTour = tours.find((t) => t.id === selectedTourId) || tour || tours[0];

  const [leadName, setLeadName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passport, setPassport] = useState('');
  const [nationality, setNationality] = useState('United States');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [departureDate, setDepartureDate] = useState<string>(activeTour?.departureDates[0] || '2026-11-20');
  const [specialRequests, setSpecialRequests] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<TourBooking | null>(null);

  if (!isOpen) return null;

  const totalUSD = calculateBookingTotal(activeTour ? activeTour.priceUSD : 0, guestCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!leadName.trim()) {
      setErrorMsg('Please enter the lead traveler full name as shown in passport.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please provide a mobile or WhatsApp contact number.');
      return;
    }
    if (!validatePassportNumber(passport)) {
      setErrorMsg('Please enter a valid passport number (at least 6 alphanumeric characters) for required tourist permits.');
      return;
    }

    const bookingCode = generateTrackingCode();
    const newBooking: TourBooking = {
      id: `book-${Date.now()}`,
      bookingCode,
      tourId: activeTour.id,
      tourTitle: activeTour.title,
      departureDate,
      guestCount,
      leadGuestName: leadName,
      passportNumber: passport.toUpperCase().trim(),
      nationality,
      email,
      phone,
      specialRequests,
      totalAmountUSD: totalUSD,
      currency,
      convertedAmount: totalUSD,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onBookingConfirmed(newBooking);
    setConfirmedBooking(newBooking);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    // Auto generate voucher PDF
    try {
      generateBookingVoucherPDF(newBooking, activeTour);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadVoucherAgain = () => {
    if (confirmedBooking && activeTour) {
      generateBookingVoucherPDF(confirmedBooking, activeTour);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 block">
              Inbound Tourist Reservation · Otithi Philosophy
            </span>
            <h3 className="text-lg font-bold text-white">
              {confirmedBooking ? 'Booking Confirmed & Issued' : 'Confirm Tour Booking'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Success Screen */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-slate-900">
                You're All Set! Swagatam to Bangladesh.
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your inbound travel pass has been issued and the PDF voucher has been downloaded to your device.
              </p>
            </div>

            {/* Tracking Code Badge Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Live Tour Tracking Code
              </span>
              <span className="text-3xl font-extrabold text-slate-900 tracking-wider font-mono block my-1">
                {confirmedBooking.bookingCode}
              </span>
              <span className="text-xs text-slate-500 block">
                Share this reference with family back home to follow your daily live tour checkpoints and safety status.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block">Lead Traveler:</span>
                <span className="font-semibold text-slate-900">{confirmedBooking.leadGuestName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Passport:</span>
                <span className="font-semibold text-slate-900 font-mono">{confirmedBooking.passportNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Departure Date:</span>
                <span className="font-semibold text-slate-900">{confirmedBooking.departureDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Group Size:</span>
                <span className="font-semibold text-slate-900">{confirmedBooking.guestCount} Adult(s)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadVoucherAgain}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                <span>Re-Download Voucher PDF</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onTrackTour(confirmedBooking.bookingCode);
                }}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Open Live Tracking Console</span>
              </button>
            </div>

          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Tour Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Selected Tour Package
              </label>
              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
              >
                {tours.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.durationDays}D/{t.durationNights}N) - {formatPrice(t.priceUSD, currency)}/person
                  </option>
                ))}
              </select>
            </div>

            {/* Traveler Information Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Traveler Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passport Number * <span className="text-[10px] text-slate-400">(for Govt Tourist Permit)</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="e.g. P12345678"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 uppercase font-mono focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleanor@example.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-019-2834"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nationality / Country of Passport
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Singapore">Singapore</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of International Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Traveler' : 'Travelers'}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Departure Date selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Departure Date
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min="2026-11-15"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            {/* Dietary or medical needs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Dietary or Health Requirements (Optional)
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian, nut allergy, airport wheelchair assistance required"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Summary & Price Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">All-Inclusive Total ({guestCount} guest{guestCount > 1 ? 's' : ''}):</span>
                <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatPrice(totalUSD, currency)}
                </div>
              </div>

              <div className="text-right text-[11px] text-emerald-700 font-medium">
                <span className="flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Free Permit Processing
                </span>
                <span className="text-slate-400">Instant PDF Voucher & QR</span>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Confirm & Issue Travel Pass
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
