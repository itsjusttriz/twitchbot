import { dehashChannel } from "../helper/dehash-channels";
import { updateStoredChannels } from "../helper/update-stored-channels";
import { Event } from "../utils/interfaces/Event";
import { LogPrefixes, logger } from "../utils/Logger";

export const event = {
    name: 'part',
    once: false,

    run: async (client, channel: string, username: string, self: boolean) => {
        if (!self)
            return;

        if (client.settings.debug.isToggled)
            client.chat.say(client.settings.debug.logChannel, `Left ${channel}`);

        logger.setPrefix(LogPrefixes.EVENTS).info(`Left ${channel}`)

        if (!client.settings.debug.isToggled)
            await updateStoredChannels(dehashChannel(channel), 'REMOVE').catch(e => {
                logger.setPrefix(LogPrefixes.EVENTS).error(`Failed to run updateStoredChannels() of type "REMOVE": ${e}`);
            });
        return;
    }
} as Event;