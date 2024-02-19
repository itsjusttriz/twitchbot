import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

type BanTags = {
    'target-user-id': string;
    'room-id': string;
};

export const event = {
    name: 'join',
    once: false,

    run: async (client, channel: string, username: string, reason: null, tags: BanTags) => {
        logger.sysEvent.info(`BAN -> channel: ${channel} || username: ${username}`);
        return;
    },
} as Event;
