import { z } from "zod";

export const WeatherQuerySchema = z.object({
  lat: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return NaN;
      return typeof val === "number" ? val : Number(val);
    },
    z.number().min(-90).max(90, { message: "lat must be between -90 and 90" })
  ),
  lon: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return NaN;
      return typeof val === "number" ? val : Number(val);
    },
    z.number().min(-180).max(180, { message: "lon must be between -180 and 180" })
  ),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
  ai: z.coerce.boolean().optional().default(false),
});

export const RiskBodySchema = z.object({
  weather: z
    .object({
      wind: z.number(),
      humidity: z.number(),
      rain: z.number(),
      temp: z.number(),
      uv: z.number(),
      visibility: z.number(),
    })
    .optional(),
  lat: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return NaN;
      return typeof val === "number" ? val : Number(val);
    },
    z.number().min(-90).max(90, { message: "lat must be between -90 and 90" })
  ).optional(),
  lon: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return NaN;
      return typeof val === "number" ? val : Number(val);
    },
    z.number().min(-180).max(180, { message: "lon must be between -180 and 180" })
  ).optional(),
}).refine((data) => data.weather || (typeof data.lat === "number" && typeof data.lon === "number"), {
  message: "Provide either `weather` or both `lat` and `lon`.",
});

export type WeatherQuery = z.infer<typeof WeatherQuerySchema>;
export type RiskBody = z.infer<typeof RiskBodySchema>;
