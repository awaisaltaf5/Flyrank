/**
 * Server-side URL security for the MetaSpark AI Website Metadata Analyzer.
 *
 * The analyzeWebsite tool fetches arbitrary user-supplied URLs, which creates
 * a Server-Side Request Forgery (SSRF) risk. This module blocks requests to
 * internal/private IP ranges, link-local addresses, and other non-public
 * destinations before any fetch happens.
 *
 * This module is server-only and must never be imported from client code.
 */

import net from "node:net";
import dns from "node:dns/promises";

// ─── Private / reserved IP ranges ───────────────────────────────────────────

/**
 * Check whether an IPv4 address falls into a private/reserved range.
 * Returns true if the address must be blocked.
 */
function isPrivateIPv4(address) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;

  const [a, b] = parts;

  // 0.0.0.0/8 – "this network"
  if (a === 0) return true;
  // 10.0.0.0/8 – private
  if (a === 10) return true;
  // 100.64.0.0/10 – carrier-grade NAT
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 127.0.0.0/8 – loopback
  if (a === 127) return true;
  // 169.254.0.0/16 – link-local
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 – private
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.0.0.0/24 – IETF protocol assignments
  if (a === 192 && b === 0) return true;
  // 192.0.2.0/24 – TEST-NET-1
  if (a === 192 && b === 0 && parts[2] === 2) return true;
  // 192.168.0.0/16 – private
  if (a === 192 && b === 168) return true;
  // 198.18.0.0/15 – benchmarking
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 198.51.100.0/24 – TEST-NET-2
  if (a === 198 && b === 51 && parts[2] === 100) return true;
  // 203.0.113.0/24 – TEST-NET-3
  if (a === 203 && b === 0 && parts[2] === 113) return true;
  // 224.0.0.0/4 – multicast
  if (a >= 224 && a <= 239) return true;
  // 240.0.0.0/4 – reserved
  if (a >= 240) return true;
  // 255.255.255.255 – broadcast
  if (a === 255 && b === 255 && parts[2] === 255 && parts[3] === 255) return true;

  return false;
}

/**
 * Check whether an IPv6 address is a loopback, link-local, unique-local,
 * or otherwise non-public address. Returns true if the address must be blocked.
 */
function isPrivateIPv6(address) {
  const lower = address.toLowerCase();

  // ::1 – loopback
  if (lower === "::1" || lower === "0:0:0:0:0:0:0:1") return true;
  // :: – unspecified
  if (lower === "::" || lower === "0:0:0:0:0:0:0:0") return true;
  // fe80::/10 – link-local
  if (lower.startsWith("fe80")) return true;
  // fc00::/7 – unique-local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  // fec0::/10 – site-local (deprecated)
  if (lower.startsWith("fec0")) return true;
  // ff00::/8 – multicast
  if (lower.startsWith("ff")) return true;
  // 2001:db8::/32 – documentation
  if (lower.startsWith("2001:db8")) return true;
  // ::ffff: – IPv4-mapped, check the embedded IPv4
  if (lower.startsWith("::ffff:")) {
    const v4 = lower.split("::ffff:")[1];
    if (v4 && v4.includes(".")) {
      return isPrivateIPv4(v4);
    }
  }

  return false;
}

/**
 * Resolve a hostname to all of its IP addresses and check whether any of them
 * is private/reserved. Throws a SecurityError if the hostname resolves to a
 * blocked address.
 */
async function assertPublicHostname(hostname) {
  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error(
      `Unable to resolve "${hostname}". The domain may not exist or DNS is unavailable.`,
    );
  }

  if (!addresses || addresses.length === 0) {
    throw new Error(`Unable to resolve "${hostname}".`);
  }

  for (const { address } of addresses) {
    const isPrivate = net.isIP(address) === 4
      ? isPrivateIPv4(address)
      : isPrivateIPv6(address);

    if (isPrivate) {
      throw new Error(
        `Blocked: "${hostname}" resolves to a private or reserved address (${address}). ` +
          "For security, this analyzer only fetches public websites.",
      );
    }
  }
}

/**
 * Validate a URL before fetching:
 *  - Must be http/https
 *  - Must have a hostname
 *  - Hostname must not be an IP literal in a private/reserved range
 *  - Hostname must resolve to at least one public IP
 *
 * Throws an Error with a user-safe message when the URL is not safe to fetch.
 */
export async function assertSafeUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("The URL is malformed and could not be parsed.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http:// and https:// URLs can be analyzed.");
  }

  const hostname = url.hostname;
  if (!hostname) {
    throw new Error("The URL does not contain a hostname.");
  }

  // If the hostname is an IP literal, check it directly.
  const ipVersion = net.isIP(hostname);
  if (ipVersion === 4) {
    if (isPrivateIPv4(hostname)) {
      throw new Error(
        `Blocked: "${hostname}" is a private or reserved address. ` +
          "For security, this analyzer only fetches public websites.",
      );
    }
    return;
  }
  if (ipVersion === 6) {
    if (isPrivateIPv6(hostname)) {
      throw new Error(
        `Blocked: "${hostname}" is a private or reserved address. ` +
          "For security, this analyzer only fetches public websites.",
      );
    }
    return;
  }

  // Otherwise resolve the hostname and check every resolved address.
  await assertPublicHostname(hostname);
}

export default assertSafeUrl;