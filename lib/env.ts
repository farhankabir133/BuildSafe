import { z } from "zod";

const envSchema = z.object({
  WEATHERAI_API_KEY: z
    .string()
    .min(1, "WEATHERAI_API_KEY is required")
    .startsWith("wai_", "WEATHERAI_API_KEY must start with 'wai_'"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function validateEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse({
    WEATHERAI_API_KEY: process.env.WEATHERAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Environment validation failed: ${errors}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export function getEnv(): Env {
  if (!cachedEnv) {
    return validateEnv();
  }
  return cachedEnv;
}
