import { Channel } from '../types';

// Cache duration in milliseconds (12 hours)
const CACHE_DURATION = 12 * 60 * 60 * 1000;

/**
 * Fetches and parses an M3U playlist from a URL, with caching support.
 * The parsed data is stored in localStorage to avoid re-fetching and re-parsing
 * on every page load, improving performance.
 * @param {string} url - The URL of the M3U playlist.
 * @returns {Promise<Channel[]>} A promise that resolves to an array of Channel objects.
 */
export async function fetchAndParseM3U(url: string): Promise<Channel[]> {
  const cachedData = localStorage.getItem('iptv_cache');
  const cachedTimestamp = localStorage.getItem('iptv_cache_timestamp');

  if (cachedData && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp, 10)) < CACHE_DURATION) {
    console.log('Loading channels from cache.');
    return JSON.parse(cachedData);
  }

  console.log('Fetching fresh playlist...');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch playlist: ${res.statusText}`);
  }
  const text = await res.text();
  
  const lines = text.split('\n').map(l => l.trim());
  const items: Channel[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF')) {
      const info = lines[i];
      // The stream URL is expected on the next line
      const stream = lines[i + 1] || '';
      
      // A robust regex to parse attributes like tvg-logo, group-title, etc.
      const attrRegex = /(\S+?)="([^"]*)"/g;
      const attrs: { [key: string]: string } = {};
      let m;
      while ((m = attrRegex.exec(info)) !== null) {
        attrs[m[1]] = m[2];
      }
      
      // The channel name is the part after the last comma
      const name = info.split(',').slice(1).join(',').trim();
      
      // Skip entry if it's malformed (e.g., no name or no stream url)
      if (!name || !stream || !stream.startsWith('http')) {
        continue;
      }

      const countryCode = attrs['tvg-country'];
      const countryName = countryCode ? COUNTRY_CODE_MAP[countryCode] || countryCode : null;

      items.push({
        id: attrs['tvg-id'] || `${name}-${i}`,
        name,
        country: countryName,
        genres: attrs['group-title'] ? attrs['group-title'].split(';').map(s => s.trim()) : [],
        logo: attrs['tvg-logo'] || null,
        stream,
        raw: info,
      });
    }
  }
  
  // Store the freshly parsed data and timestamp in cache
  try {
    localStorage.setItem('iptv_cache', JSON.stringify(items));
    localStorage.setItem('iptv_cache_timestamp', Date.now().toString());
  } catch (error) {
    console.error("Could not write to localStorage. Cache disabled.", error);
  }

  return items;
}

// Simple mapping for some common country codes to full names for better display
const COUNTRY_CODE_MAP: { [key: string]: string } = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  IN: 'India',
  JP: 'Japan',
  CN: 'China',
  RU: 'Russia',
  BR: 'Brazil',
  MX: 'Mexico',
  ZA: 'South Africa',
  // Add more as needed
};
