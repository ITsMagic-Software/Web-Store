type LogLevel = "info" | "warn" | "error";

export interface LogFields {
  service: string;
  operation: string;
  code?: string;
  attempt?: number;
  status?: number;
  durationMs?: number;
  skippedInvalid?: number;
  invalidDates?: number;
  correlationId?: string;
  err?: { name: string; message: string; stack?: string };
}

function write(level: LogLevel, message: string, fields: LogFields) {
  const output = JSON.stringify({ level, msg: message, ...fields });
  if (level === "error") console.error(output);
  else if (level === "warn") console.warn(output);
  else console.info(output);
}

export const logger = {
  info: (message: string, fields: LogFields) => write("info", message, fields),
  warn: (message: string, fields: LogFields) => write("warn", message, fields),
  error: (message: string, fields: LogFields) => write("error", message, fields),
};
