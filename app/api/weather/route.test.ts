import { describe, it, expect, vi, beforeEach } from "vitest";
import { resetRateLimit } from "@/lib/rate-limit";

const mockFetchWeather = vi.fn().mockResolvedValue({
  wind: 10,
  humidity: 50,
  rain: 5,
  temp: 20,
  uv: 3,
  visibility: 10,
});

vi.mock("@/lib/env", () => ({
  validateEnv: () => {},
  getEnv: () => ({ WEATHERAI_API_KEY: "wai_test_key", NODE_ENV: "test" }),
}));

vi.mock("@/lib/weather-ai", () => ({
  fetchWeather: mockFetchWeather,
}));

const { GET } = await import("@/app/api/weather/route");
const { NextRequest } = await import("next/server");

describe("GET /api/weather", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetchWeather.mockResolvedValue({
      wind: 10,
      humidity: 50,
      rain: 5,
      temp: 20,
      uv: 3,
      visibility: 10,
    });
    resetRateLimit();
  });

  it("returns 400 when lat is missing", async () => {
    const req = new NextRequest("http://localhost/api/weather?lon=36.8219");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid query parameters.");
  });

  it("returns 400 when lon is missing", async () => {
    const req = new NextRequest("http://localhost/api/weather?lat=-1.2921");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid query parameters.");
  });

  it("returns 400 when lat is not a number", async () => {
    const req = new NextRequest("http://localhost/api/weather?lat=abc&lon=36.8219");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when lon is not a number", async () => {
    const req = new NextRequest("http://localhost/api/weather?lat=-1.2921&lon=xyz");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("includes rate limit headers in response", async () => {
    const req = new NextRequest("http://localhost/api/weather?lat=-1.2921&lon=36.8219&units=metric");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("50");
    expect(res.headers.get("X-Request-ID")).toBeTruthy();
    expect(res.headers.get("X-RateLimit-Remaining")).toBeTruthy();
    expect(res.headers.get("X-RateLimit-Reset")).toBeTruthy();
  });
});
