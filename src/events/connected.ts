import { joinChannelsOnStartup } from "../helper/join-channels-on-startup";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";
import { logger } from "../utils/Logger";

export const event = {
    name: 'connected',
    once: true,
    run: async (address: string, port: number, client: IJTTwitchClient) => {
        logger
            .setPrefix('[System/Chat]')
            .success('Connected to', address, '-', port)

        if (client.settings.debug)
            client.chat.join('itsjusttriz');
        else
            await joinChannelsOnStartup(client).catch(e => {
                logger
                    .setPrefix('[Chat/Events]')
                    .error('Failed to run joinChannels():', e);
            });
        return;
    }
} as Event;