import fs from "node:fs";
import path from "node:path";
import winston, { format } from "winston";
import { LOG_FILE_PATH } from "./constants";

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message }) => {
        return `${level}: ${message}`;
      }),
    ),
  }),
];

if (LOG_FILE_PATH) {
  const logDir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  transports.push(
    new winston.transports.File({
      filename: LOG_FILE_PATH,
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  );
}

export default transports;
