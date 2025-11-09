/**
 * Represents a single IPTV channel parsed from the M3U playlist.
 */
export interface Channel {
  id: string;
  name: string;
  country: string | null;
  genres: string[];
  logo: string | null;
  stream: string;
  raw: string; // The original #EXTINF line
}
