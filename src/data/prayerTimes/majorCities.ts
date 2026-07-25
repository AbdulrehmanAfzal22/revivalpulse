import type { Coordinates } from 'types/prayerTimes.types';

export interface MajorCity extends Coordinates {
  name: string;
  country: string;
}

/**
 * Curated, not exhaustive — manual location override. AlAdhan's address
 * geocoding was checked live and returned wrong coordinates for "Mecca"
 * (resolved near Abuja, Nigeria), so it isn't used; these are well-known,
 * fixed coordinates instead.
 */
export const MAJOR_CITIES: MajorCity[] = [
  { name: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { name: 'Medina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692 },
  { name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753 },
  { name: 'Jeddah', country: 'Saudi Arabia', latitude: 21.4858, longitude: 39.1925 },
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Ankara', country: 'Turkey', latitude: 39.9334, longitude: 32.8597 },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773 },
  { name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.531 },
  { name: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774 },
  { name: 'Manama', country: 'Bahrain', latitude: 26.2285, longitude: 50.586 },
  { name: 'Muscat', country: 'Oman', latitude: 23.588, longitude: 58.3829 },
  { name: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284 },
  { name: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661 },
  { name: 'Damascus', country: 'Syria', latitude: 33.5138, longitude: 36.2765 },
  { name: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018 },
  { name: 'Jerusalem', country: 'Palestine', latitude: 31.7683, longitude: 35.2137 },
  { name: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.389 },
  { name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
  { name: 'Lahore', country: 'Pakistan', latitude: 31.5497, longitude: 74.3436 },
  { name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
  { name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125 },
  { name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.209 },
  { name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777 },
  { name: 'Hyderabad', country: 'India', latitude: 17.385, longitude: 78.4867 },
  { name: 'Kabul', country: 'Afghanistan', latitude: 34.5553, longitude: 69.2075 },
  { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.139, longitude: 101.6869 },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { name: 'Manila', country: 'Philippines', latitude: 14.5995, longitude: 120.9842 },
  { name: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898 },
  { name: 'Rabat', country: 'Morocco', latitude: 34.0209, longitude: -6.8416 },
  { name: 'Algiers', country: 'Algeria', latitude: 36.7538, longitude: 3.0588 },
  { name: 'Tunis', country: 'Tunisia', latitude: 36.8065, longitude: 10.1815 },
  { name: 'Tripoli', country: 'Libya', latitude: 32.8872, longitude: 13.1913 },
  { name: 'Khartoum', country: 'Sudan', latitude: 15.5007, longitude: 32.5599 },
  { name: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792 },
  { name: 'Abuja', country: 'Nigeria', latitude: 9.0765, longitude: 7.3986 },
  { name: 'Nairobi', country: 'Kenya', latitude: -1.2921, longitude: 36.8219 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5072, longitude: -0.1276 },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405 },
  { name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173 },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { name: 'Chicago', country: 'United States', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
];
