import { ChatUserstate } from 'tmi.js';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'whisper',
    once: false,
    isDisabled: true,
    run: async (client, from: string, tags: ChatUserstate, message: string, self) => {
        // Don't listen to my own messages..
        if (self) return;

        try {
            await client.chat.whisper(
                tags.username,
                'Commands are not functional via whispers. Please try again, in a mutually connected channel.'
            );
        } catch (error) {
            logger.sysEvent.error(`[EVENTS/WHISPER] -> Failed to reply to ${tags.username}:`, error);
        }
        return;
    },
} as Event;
