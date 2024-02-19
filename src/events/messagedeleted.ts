import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

type MessageDeletedTags = {
    'target-msg-id': string;
};

export const event = {
    name: 'join',
    once: false,

    run: async (client, channel: string, username: string, deletedMsg: string, tags: MessageDeletedTags) => {
        logger.sysEvent.info(
            `MESSAGE DELETED -> channel: ${channel} || username: ${username} || msgId: ${tags['target-msg-id']}`
        );
        return;
    },
} as Event;
