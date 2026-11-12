import { RouteWaypoint, TourCategory, TourPackage } from '../types/tour';

/**
 * Validates passport number (min 6 alphanumeric characters).
 */
export function validatePassportNumber(passport: string): boolean {
  if (!passport) return false;
  const clean = passport.trim();
  return /^[A-Za-z0-9]{6,15}$/.test(clean);
}

/**
 * Generates an inbound tourist tracking code like TB-8291.
 */
export function generateTrackingCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TB-${num}`;
}

/**
 * Calculates percentage completion of tour route based on waypoints passed.
 */
export function calculateRouteProgress(waypoints: RouteWaypoint[]): number {
  if (!waypoints || waypoints.length === 0) return 0;
  const passed = waypoints.filter(w => w.passed).length;
  return Math.round((passed / waypoints.length) * 100);
}

/**
 * Filters tour packages based on category, search keyword, and duration filters.
 */
export function filterTourPackages(
  packages: TourPackage[],
  category: TourCategory,
  searchQuery: string,
  maxDurationDays?: number
): TourPackage[] {
  const query = searchQuery.trim().toLowerCase();
  
  return packages.filter(pkg => {
    // Category match
    if (category !== 'all' && pkg.category !== category) {
      return false;
    }

    // Duration filter
    if (maxDurationDays && pkg.durationDays > maxDurationDays) {
      return false;
    }

    // Search query match
    if (query) {
      const matchTitle = pkg.title.toLowerCase().includes(query);
      const matchTagline = pkg.tagline.toLowerCase().includes(query);
      const matchLocation = pkg.location.toLowerCase().includes(query);
      const matchHighlights = pkg.highlights.some(h => h.toLowerCase().includes(query));
      if (!matchTitle && !matchTagline && !matchLocation && !matchHighlights) {
        return false;
      }
    }

    return true;
  });
}
