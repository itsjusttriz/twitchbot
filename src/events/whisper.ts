import { ChatUserstate } from "tmi.js";
import { Event } from "../utils/interfaces/Event";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { logger } from "../utils/logger";

export const event = {
    name: 'whisper',
    once: false,
    isDisabled: true,
    run: async (from: string, tags: ChatUserstate, message: string, self: boolean, client: IJTTwitchClient) => {
        // Don't listen to my own messages..
        if (self) return;

        client.chat.whisper(tags.username,
            'Commands are not functional via whispers. Please try again, in a mutually connected channel.'
        ).catch(e => {
            logger.error(`[System/Events] Failed to whisper ${tags.username}: `, e);
        });
        return;
    }
} as Event;