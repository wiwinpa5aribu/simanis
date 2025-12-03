import fs from 'fs'
import path from 'path'
import winston from 'winston'
import { config } from '../config'

// Ensure logs directory exists
const logsDir = config.logging.filePath
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Custom format untuk console (colorized)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = ''
    if (Object.keys(meta).length > 0) {
      metaStr = '\n' + JSON.stringify(meta, null, 2)
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`
  })
)

// JSON format untuk file (structured logging)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Create Winston logger
export const logger = winston.createLogger({
  level: config.logging.level,
  defaultMeta: { service: 'simanis-backend' },
  transports: [
    // Console transport (development)
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // File transport - error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport - combined logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
})

// Production: disable console logging
if (config.env === 'production') {
  logger.remove(logger.transports[0]) // Remove console transport
}

// Helper function untuk log dengan context
export const logWithContext = (
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  context?: Record<string, unknown>
) => {
  logger.log(level, message, context)
}
