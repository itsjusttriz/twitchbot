import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

type TimeoutTags = {
    'target-user-id': string;
    'room-id': string;
};

export const event = {
    name: 'timeout',
    once: false,

    run: async (client, channel: string, username: string, reason: null, duration: number, tags: TimeoutTags) => {
        logger.sysEvent.info(`TIMEOUT -> channel: ${channel} || username: ${username} || duration: ${duration}`);
        return;
    },
} as Event;
