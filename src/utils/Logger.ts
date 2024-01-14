import { Logger, ANSIColors } from '@itsjusttriz/logger';

type LoggerProps = {
    sysChat: Logger;
    sysEvent: Logger;
    sysDebug: Logger;
    db: Logger;
    svcDecApi: Logger;
    svcIjtApi: Logger;
    svcBackend: Logger;
};

const logger: LoggerProps = {
    sysChat: new Logger({
        includeTimestamp: false,
        customPrefix: '[CHAT]',
    }),
    sysEvent: new Logger({
        includeTimestamp: false,
        customPrefix: '[EVENT]',
    }),
    sysDebug: new Logger({
        includeTimestamp: false,
        customPrefix: `${ANSIColors.DEBUG}[DEBUG]${ANSIColors.RESET}`,
    }),
    db: new Logger({
        includeTimestamp: false,
        customPrefix: '[DATABASE]',
    }),
    svcDecApi: new Logger({
        includeTimestamp: false,
        customPrefix: '[DECAPI]',
    }),
    svcIjtApi: new Logger({
        includeTimestamp: false,
        customPrefix: '[IJTAPI]',
    }),
    svcBackend: new Logger({
        includeTimestamp: false,
        customPrefix: '[BACKEND]',
    }),
};

export { logger, ANSIColors };
