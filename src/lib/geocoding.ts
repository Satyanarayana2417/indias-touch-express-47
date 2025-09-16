// Google Reverse Geocoding utility
// Uses the Google Maps Geocoding API if VITE_GOOGLE_MAPS_API_KEY is present.
// Falls back to throwing if missing so caller can attempt alternative providers.

export interface ReverseGeocodeResult {
  city: string;
  state: string;
  country: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
}

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleGeocodeResponse {
  results: Array<{
    formatted_address: string;
    address_components: GoogleAddressComponent[];
  }>;
  status: string;
  error_message?: string;
}

const componentLookup = (components: GoogleAddressComponent[], type: string) => {
  return components.find(c => c.types.includes(type))?.long_name || '';
};

export async function reverseGeocodeGoogle(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_GOOGLE_MAPS_API_KEY');
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Google Geocoding network error');
  const data: GoogleGeocodeResponse = await resp.json();
  if (data.status !== 'OK' || !data.results.length) {
    throw new Error(data.error_message || `Google Geocoding failed: ${data.status}`);
  }
  const primary = data.results[0];
  const comps = primary.address_components;
  const city = componentLookup(comps, 'locality') || componentLookup(comps, 'postal_town') || componentLookup(comps, 'administrative_area_level_2') || 'Unknown City';
  const state = componentLookup(comps, 'administrative_area_level_1');
  const country = componentLookup(comps, 'country');
  return {
    city,
    state,
    country,
    fullAddress: primary.formatted_address,
    latitude: lat,
    longitude: lng
  };
}
