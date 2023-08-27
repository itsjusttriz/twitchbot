import { dehashChannel } from '../helper/dehash-channels';
import { updateStoredChannels } from '../helper/update-stored-channels';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'join',
    once: false,

    run: async (client, channel: string, username: string, self: boolean) => {
        if (!self) return;

        if (client.settings.debug.enabled) client.chat.say(client.settings.debug.logChannel, `Joined ${channel}`);
        logger.sysEvent.info(`Joined ${channel}`);

        if (!client.settings.debug.enabled)
            await updateStoredChannels(dehashChannel(channel), 'ADD').catch((e) => {
                logger.sysEvent.error(`Failed to run updateStoredChannels() of type "ADD": ${e}`);
            });
        return;
    },
} as Event;
