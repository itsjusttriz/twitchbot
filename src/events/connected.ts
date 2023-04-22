import { joinChannelsOnStartup } from "../helper/join-channels-on-startup";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";
import { logger } from "../utils/logger";

export const event = {
    name: 'connected',
    once: true,
    run: async (address: string, port: number, client: IJTTwitchClient) => {
        logger.success('[System/Chat] Connected to', address, '-', port)

        if (client.settings.debug)
            client.chat.join('itsjusttriz');
        else
            await joinChannelsOnStartup(client).catch(e => {
                logger.error('[Chat/Events] Failed to run joinChannels():', e);
            });
        return;
    }
} as Event;