import { updateStoredChannels } from "../helper/update-stored-channels";
import { Event } from "../utils/interfaces/Event";
import { LogPrefixes, logger } from "../utils/Logger";

export const event = {
    name: 'join',
    once: false,

    run: async (client, channel: string, username: string, self: boolean) => {
        if (!self)
            return;

        if (client.settings.debug.toggle)
            client.chat.say(client.settings.debug.logChannel, `Joined ${channel}`);
        logger
            .setPrefix(LogPrefixes.EVENTS)
            .info(`Joined ${channel}`);

        if (!client.settings.debug)
            await updateStoredChannels(channel.replace('#', ''), 'ADD').catch(e => {
                logger
                    .setPrefix(LogPrefixes.EVENTS)
                    .error(`Failed to run updateStoredChannels() of type "ADD": ${e}`);
            })
        return;
    }
} as Event;