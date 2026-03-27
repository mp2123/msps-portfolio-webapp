import { createHash } from "node:crypto";

export type RequestMetadata = {
  requestCountry: string | null;
  requestRegion: string | null;
  requestCity: string | null;
  visitorHash: string | null;
};

export function buildRequestMetadata(req: Request): RequestMetadata {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "";
  const visitorHash = ip
    ? createHash("sha256").update(ip).digest("hex").slice(0, 16)
    : null;

  return {
    requestCountry: req.headers.get("x-vercel-ip-country") ?? null,
    requestRegion: req.headers.get("x-vercel-ip-country-region") ?? null,
    requestCity: req.headers.get("x-vercel-ip-city") ?? null,
    visitorHash,
  };
}
