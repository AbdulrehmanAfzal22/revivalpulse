import type { MajorCity } from 'data/prayerTimes/majorCities';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

export async function searchWorldwideCities(query: string, signal?: AbortSignal): Promise<MajorCity[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    'accept-language': 'en',
    limit: '8',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, { signal });
  if (!response.ok) throw new Error(`Location search failed (status ${response.status})`);
  const results = (await response.json()) as NominatimResult[];

  const cities = results.map((result) => {
    const address = result.address ?? {};
    const name = address.city ?? address.town ?? address.village ?? address.municipality ?? result.display_name.split(',')[0] ?? 'Unknown city';
    const country = address.country ?? 'Unknown country';
    return { name, country, latitude: Number(result.lat), longitude: Number(result.lon) };
  }).filter((city) => Number.isFinite(city.latitude) && Number.isFinite(city.longitude));

  return cities.filter((city, index) =>
    cities.findIndex((candidate) => candidate.name === city.name && candidate.country === city.country) === index
  );
}
