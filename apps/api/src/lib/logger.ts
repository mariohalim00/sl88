import pino from 'pino';

const isProduction = process.env['NODE_ENV'] === 'production';

const level = process.env['LOG_LEVEL'] ?? (isProduction ? 'info' : 'debug');

const loggerOptions: pino.LoggerOptions = {
  level,
  base: {
    service: 'api',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const transport =
  isProduction
    ? undefined
    : pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: true,
        },
      });

export const logger = pino(loggerOptions, transport);