export type TourCategory = 'all' | 'eco_wildlife' | 'heritage' | 'tea_highlands' | 'river_marine';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'BDT';

export interface GuideProfile {
  name: string;
  photoUrl: string;
  licenseNumber: string;
  languages: string[];
  experienceYears: number;
  phone: string;
  whatsapp: string;
  rating: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  stay: string;
  activities: string[];
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: TourCategory;
  durationDays: number;
  durationNights: number;
  priceUSD: number;
  priceBDT: number;
  rating: number;
  reviewsCount: number;
  location: string;
  departurePoint: string;
  departureDates: string[];
  image: string;
  featured: boolean;
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Active';
  foreignPermitRequired: boolean;
  guide: GuideProfile;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  packingAdvice: string[];
}

export interface TourBooking {
  id: string;
  bookingCode: string;
  tourId: string;
  tourTitle: string;
  departureDate: string;
  guestCount: number;
  leadGuestName: string;
  passportNumber: string;
  nationality: string;
  email: string;
  phone: string;
  specialRequests?: string;
  totalAmountUSD: number;
  currency: CurrencyCode;
  convertedAmount: number;
  status: 'confirmed' | 'active_today' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RouteWaypoint {
  name: string;
  lat: number;
  lng: number;
  passed: boolean;
  eta?: string;
  description?: string;
}

export interface TourAnnouncement {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  type: 'info' | 'alert' | 'checkpoint' | 'weather';
}

export interface LiveTourSession {
  id: string;
  tourId: string;
  tourTitle: string;
  trackingCode: string;
  status: 'en_route' | 'checkpoint_stop' | 'safari_active' | 'break' | 'completed';
  statusLabel: string;
  vehicleType: string;
  vehicleReg: string;
  guide: GuideProfile;
  batteryLevel: number;
  signalQuality: string;
  currentCheckpoint: string;
  nextCheckpoint: string;
  etaNextCheckpoint: string;
  speedKmh: number;
  currentCoords: {
    lat: number;
    lng: number;
  };
  routeWaypoints: RouteWaypoint[];
  announcements: TourAnnouncement[];
  emergencyContacts: Array<{
    title: string;
    phone: string;
    role: string;
  }>;
}
