import { dehashChannel } from '../helper/dehash-channels';
import { updateStoredChannels } from '../helper/update-stored-channels';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'part',
    once: false,

    run: async (client, channel: string, username: string, self: boolean) => {
        if (!self) return;

        if (client.settings.debug.enabled) client.chat.say(client.settings.debug.logChannel, `Left ${channel}`);

        logger.sysEvent.info(`Left ${channel}`);

        if (!client.settings.debug.isToggled)
            await updateStoredChannels(dehashChannel(channel), 'REMOVE').catch((e) => {
                logger.sysEvent.error(`Failed to run updateStoredChannels() of type "REMOVE": ${e}`);
            });
        return;
    },
} as Event;
