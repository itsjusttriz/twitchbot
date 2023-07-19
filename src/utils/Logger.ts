import { Logger, ANSIColors } from '@itsjusttriz/logger';

const logger = new Logger();

enum LogPrefixes {
    CHAT_MESSAGE = '[System/Chat]',
    EVENTS = '[System/Events]',
    DATABASE = '[System/Database]',

    SERVICES_DECAPI = '[Services/Decapi]',
    SERVICES_IJT_API = '[Services/ijt-api]',
    SERVICES_BACKEND = '[System/Backend]',

    DEBUG_MODE = `${ANSIColors.DEBUG}[System/DEBUG]${ANSIColors.RESET}`
}

export { logger, ANSIColors, LogPrefixes };