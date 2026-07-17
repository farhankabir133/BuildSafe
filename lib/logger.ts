/**
 * Structured logger for the Construction Intelligence Engine.
 * Uses console with JSON formatting for production readiness.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

type LogContext = {
  requestId?: string;
  method?: string;
  path?: string;
  status?: number;
  duration?: number;
  [key: string]: unknown;
};

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  if (process.env.NODE_ENV === "production") {
    return LEVELS[level] >= LEVELS.info;
  }
  return true;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) return;

  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  if (process.env.NODE_ENV === "production") {
    console.log(JSON.stringify(entry));
  } else {
    const prefix = `[${entry.timestamp}] ${level.toUpperCase()}`;
    console.log(`${prefix}: ${message}`, context ?? "");
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => formatMessage("info", message, context),
  warn: (message: string, context?: LogContext) => formatMessage("warn", message, context),
  error: (message: string, context?: LogContext) => formatMessage("error", message, context),
  debug: (message: string, context?: LogContext) => formatMessage("debug", message, context),
};

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
