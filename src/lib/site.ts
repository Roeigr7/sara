/** Production site URL — canonical base for metadata, sitemap, robots, JSON-LD. */
const FALLBACK = "https://saralaw.co.il";

function normalizeBase(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      return FALLBACK;
    }
    return u.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK;
  }
}

/**
 * Set `NEXT_PUBLIC_SITE_URL` in Vercel (e.g. `https://saralaw.co.il`) if the default
 * should differ; otherwise the live domain is used.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return normalizeBase(fromEnv);
  }
  return FALLBACK;
}

export const siteUrl = getSiteUrl();
