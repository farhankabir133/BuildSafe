import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it("allows requests under the limit", () => {
    const result = rateLimit("127.0.0.1", 3, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests over the limit", () => {
    rateLimit("127.0.0.1", 2, 60_000);
    rateLimit("127.0.0.1", 2, 60_000);
    const result = rateLimit("127.0.0.1", 2, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks separate limits per IP", () => {
    rateLimit("127.0.0.1", 1, 60_000);
    const result2 = rateLimit("192.168.1.1", 1, 60_000);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(0);
  });

  it("returns resetAt timestamp", () => {
    const before = Date.now();
    const result = rateLimit("127.0.0.1", 1, 60_000);
    expect(result.resetAt).toBeGreaterThanOrEqual(before);
    expect(result.resetAt).toBeLessThanOrEqual(before + 60_000);
  });
});
