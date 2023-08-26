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
        customPrefix: '[System/CHAT]',
    }),
    sysEvent: new Logger({
        customPrefix: '[System/EVENT]',
    }),
    sysDebug: new Logger({
        customPrefix: `${ANSIColors.DEBUG}[System/DEBUG]${ANSIColors.RESET}`,
    }),
    db: new Logger({
        customPrefix: '[System/DATABASE]',
    }),
    svcDecApi: new Logger({
        customPrefix: '[Services/DECAPI]',
    }),
    svcIjtApi: new Logger({
        customPrefix: '[Services/IJTAPI]',
    }),
    svcBackend: new Logger({
        customPrefix: '[Services/BACKEND]',
    }),
};

export { logger, ANSIColors };
