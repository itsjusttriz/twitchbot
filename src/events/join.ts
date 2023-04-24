import { updateStoredChannels } from "../helper/update-stored-channels";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";
import { LogPrefixes, logger } from "../utils/Logger";

export const event = {
    name: 'join',
    once: false,

    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        if (client.settings.debug)
            client.chat.say('itsjusttriz', `Joined ${channel}`);
        logger
            .setPrefix(LogPrefixes.COLORED_EVENTS)
            .info(`TEST-Joined ${channel}`);

        if (!client.settings.debug)
            await updateStoredChannels(channel.replace('#', ''), 'ADD').catch(e => {
                logger
                    .setPrefix(LogPrefixes.COLORED_EVENTS)
                    .error(`Failed to run updateStoredChannels() of type "ADD": ${e}`);
            })
        return;
    }
} as Event;