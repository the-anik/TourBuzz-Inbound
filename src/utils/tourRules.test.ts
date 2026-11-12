import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePassportNumber, calculateRouteProgress, filterTourPackages } from './tourRules';
import { RouteWaypoint, TourPackage } from '../types/tour';

test('validatePassportNumber verifies valid alphanumeric travel passports', () => {
  assert.equal(validatePassportNumber('A1234567'), true);
  assert.equal(validatePassportNumber('US987654321'), true);
  assert.equal(validatePassportNumber('short'), false);
  assert.equal(validatePassportNumber(''), false);
  assert.equal(validatePassportNumber('  '), false);
  assert.equal(validatePassportNumber('invalid@#$'), false);
});

test('calculateRouteProgress computes waypoint completion percentage', () => {
  const waypoints: RouteWaypoint[] = [
    { name: 'Start', lat: 23, lng: 90, passed: true },
    { name: 'Checkpoint 1', lat: 23.5, lng: 90.5, passed: true },
    { name: 'Checkpoint 2', lat: 24, lng: 91, passed: false },
    { name: 'Final', lat: 24.5, lng: 91.5, passed: false },
  ];
  assert.equal(calculateRouteProgress(waypoints), 50);

  const allDone = waypoints.map(w => ({ ...w, passed: true }));
  assert.equal(calculateRouteProgress(allDone), 100);

  assert.equal(calculateRouteProgress([]), 0);
});

test('filterTourPackages filters by category and search keyword', () => {
  const mockPackages = [
    {
      id: '1',
      slug: 'sundarbans',
      title: 'Sundarbans Mangrove',
      tagline: 'Wildlife safari',
      category: 'eco_wildlife' as const,
      durationDays: 3,
      durationNights: 2,
      priceUSD: 420,
      priceBDT: 50000,
      rating: 4.9,
      reviewsCount: 38,
      location: 'Khulna',
      departurePoint: 'Dhaka',
      departureDates: [],
      image: '',
      featured: true,
      maxGroupSize: 12,
      difficulty: 'Moderate' as const,
      foreignPermitRequired: true,
      guide: { name: 'Ali', photoUrl: '', licenseNumber: 'G1', languages: [], experienceYears: 8, phone: '', whatsapp: '', rating: 5 },
      highlights: ['Royal Bengal Tiger', 'Forest cruise'],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      packingAdvice: [],
    },
    {
      id: '2',
      slug: 'old-dhaka',
      title: 'Old Dhaka Heritage',
      tagline: 'Historic city walk',
      category: 'heritage' as const,
      durationDays: 1,
      durationNights: 0,
      priceUSD: 85,
      priceBDT: 10000,
      rating: 4.8,
      reviewsCount: 65,
      location: 'Dhaka',
      departurePoint: 'Dhaka',
      departureDates: [],
      image: '',
      featured: false,
      maxGroupSize: 8,
      difficulty: 'Easy' as const,
      foreignPermitRequired: false,
      guide: { name: 'Sara', photoUrl: '', licenseNumber: 'G2', languages: [], experienceYears: 5, phone: '', whatsapp: '', rating: 4.9 },
      highlights: ['Lalbagh Fort', 'Spice market'],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      packingAdvice: [],
    },
  ];

  // Category filter
  const ecoOnly = filterTourPackages(mockPackages, 'eco_wildlife', '');
  assert.equal(ecoOnly.length, 1);
  assert.equal(ecoOnly[0].id, '1');

  // Search keyword filter
  const searchTiger = filterTourPackages(mockPackages, 'all', 'tiger');
  assert.equal(searchTiger.length, 1);
  assert.equal(searchTiger[0].id, '1');

  const searchDhaka = filterTourPackages(mockPackages, 'all', 'dhaka');
  assert.equal(searchDhaka.length, 1);
  assert.equal(searchDhaka[0].id, '2');

  // Duration filter
  const singleDay = filterTourPackages(mockPackages, 'all', '', 1);
  assert.equal(singleDay.length, 1);
  assert.equal(singleDay[0].id, '2');
});
