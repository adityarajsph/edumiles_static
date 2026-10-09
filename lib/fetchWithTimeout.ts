/**
 * fetch() wrapper with AbortController timeout.
 * Aborts the request AND response body reading after `ms` milliseconds.
 * This prevents both slow connections and hanging .json() reads from
 * freezing the UI indefinitely.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  ms = 8_000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}
