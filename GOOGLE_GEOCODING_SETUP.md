# Google Geocoding Integration

The application now supports precise reverse geocoding via the Google Maps Geocoding API. If a Google key is configured the app will attempt Google first, then fall back to OpenStreetMap (Nominatim) and finally BigDataCloud.

## 1. Enable APIs
Enable the following in Google Cloud Console (same project as your existing OAuth key if desired):
- Geocoding API
- Maps JavaScript API (optional if you later add map UI)

## 2. Create / Use an API Key
Create an API key (NOT the OAuth client ID) and restrict it:
- Application restrictions: HTTP referrers (web sites)
- Add the exact domains (production + localhost dev) e.g.
  - http://localhost:5173/*
  - https://your-production-domain.com/*
- API restrictions: Limit to Geocoding API (and Maps JavaScript API if you use it later)

## 3. Add Key to Environment
Copy `.env.example` to `.env` (never commit real `.env`).
```
VITE_GOOGLE_MAPS_API_KEY=YOUR_REAL_KEY
```
Restart the dev server after adding.

## 4. How It Works
`LocationModal` calls `reverseGeocodeGoogle()` first. If it throws (missing key or quota) the code silently falls back to Nominatim and then BigDataCloud. Returned object now includes:
- city (may include area prefix)
- state
- country
- fullAddress (Google formatted_address if available)
- latitude / longitude

`LocationContext` uses `fullAddress` for `deliveryAddress` so UI shows the most precise value.

## 5. Privacy & Quotas
- Do not log raw coordinates or full addresses server-side unless required.
- Monitor quota usage in Google Cloud Console.
- If you approach limits, consider caching results in sessionStorage to avoid repeated requests.

## 6. Optional Enhancements
- Add Places Autocomplete for manual corrections.
- Show a small map preview using the Maps JavaScript API or a static map image.
- Add a manual address entry fallback when geolocation denied.
- Cache last successful reverse geocode keyed by truncated lat/lng (e.g. 4 decimal places) in localStorage.

## 7. Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| Always falling back to OSM | Missing or invalid key | Verify `VITE_GOOGLE_MAPS_API_KEY` and rebuild |
| REQUEST_DENIED | Key not allowed for Geocoding | Add Geocoding API to key restrictions |
| Quota exceeded | Daily limit hit | Add billing / raise quota / implement caching |
| Mixed Content errors | Using http site with https key restrictions | Ensure all origins use https in production |

## 8. Security Notes
- Never expose unrestricted keys.
- For server-side secure geocoding (higher quota, conceal key), proxy requests through a minimal backend and remove key from frontend.

---
If you need help adding a map or autocomplete next, let me know.
