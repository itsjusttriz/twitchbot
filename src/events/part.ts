import { updateStoredChannels } from "../helper/update-stored-channels";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";
import { ANSIColors, LogPrefixes, logger } from "../utils/Logger";

export const event = {
    name: 'part',
    once: false,

    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        if (client.settings.debug)
            client.chat.say('itsjusttriz', `Left ${channel}`);
        logger
            .setPrefix(LogPrefixes.UNCOLORED_EVENTS)
            .info(`Left ${channel}`)

        if (!client.settings.debug)
            await updateStoredChannels(channel.replace('#', ''), 'REMOVE').catch(e => {
                logger
                    .setPrefix(LogPrefixes.COLORED_EVENTS)
                    .error('Failed to run updateStoredChannels() of type "REMOVE":', e);
            })
        return;
    }
} as Event;