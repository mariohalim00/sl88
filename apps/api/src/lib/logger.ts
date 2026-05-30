import pino from 'pino';
import pinoPretty from 'pino-pretty';

const isProduction = process.env['NODE_ENV'] === 'production';

const level = process.env['LOG_LEVEL'] ?? (isProduction ? 'info' : 'debug');

const loggerOptions: pino.LoggerOptions = {
  level,
  base: {
    service: 'api',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const prettyStream =
  isProduction
    ? undefined
    : pinoPretty({
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        singleLine: true,
      });

export const logger =
  prettyStream == null ? pino(loggerOptions) : pino(loggerOptions, prettyStream);