import { TimeoutUserstate } from 'tmi.js';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

export const event = {
    name: 'timeout',
    once: false,

    run: async (client, channel: string, username: string, reason: null, duration: number, tags: TimeoutUserstate) => {
        logger.sysEvent.info(`TIMEOUT -> channel: ${channel} || username: ${username} || duration: ${duration}`);
        return;
    },
} as Event;
