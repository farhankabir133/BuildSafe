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

const { GET, POST } = await import("@/app/api/risk/route");
const { NextRequest } = await import("next/server");

describe("GET /api/risk", () => {
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
    const req = new NextRequest("http://localhost/api/risk?lon=36.8219");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid query parameters.");
  });

  it("returns 400 when lon is missing", async () => {
    const req = new NextRequest("http://localhost/api/risk?lat=-1.2921");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid query parameters.");
  });

  it("returns 400 when lat is not a number", async () => {
    const req = new NextRequest("http://localhost/api/risk?lat=abc&lon=36.8219");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("includes rate limit headers in response", async () => {
    const req = new NextRequest("http://localhost/api/risk?lat=-1.2921&lon=36.8219");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("100");
    expect(res.headers.get("X-Request-ID")).toBeTruthy();
    expect(res.headers.get("X-RateLimit-Remaining")).toBeTruthy();
    expect(res.headers.get("X-RateLimit-Reset")).toBeTruthy();
  });
});

describe("POST /api/risk", () => {
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

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/risk", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when body has neither weather nor lat/lon", async () => {
    const req = new NextRequest("http://localhost/api/risk", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 when valid weather is provided", async () => {
    const req = new NextRequest("http://localhost/api/risk", {
      method: "POST",
      body: JSON.stringify({
        weather: { wind: 10, humidity: 50, rain: 5, temp: 20, uv: 3, visibility: 10 },
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.snapshot).toBeDefined();
    expect(body.snapshot.weather).toBeDefined();
    expect(body.snapshot.risk).toBeDefined();
    expect(body.source).toBe("provided");
  });

  it("returns 502 when WeatherAI is unavailable", async () => {
    mockFetchWeather.mockRejectedValueOnce(new Error("WeatherAI unavailable"));
    const req = new NextRequest("http://localhost/api/risk", {
      method: "POST",
      body: JSON.stringify({ lat: -1.2921, lon: 36.8219 }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(502);
  });
});
