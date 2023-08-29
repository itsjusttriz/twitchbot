import { updateStoredChannels } from '../helper/update-stored-channels';
import { _ } from '../utils';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'part',
    once: false,

    run: async (client, channel: string, username: string, self: boolean) => {
        if (!self) return;

        if (client.settings.debug.enabled) client.chat.say(client.settings.debug.logChannel, `Left ${channel}`);

        logger.sysEvent.info(`Left ${channel}`);

        if (!client.settings.debug.enabled) {
            try {
                await updateStoredChannels(_.dehashChannel(channel), 'REMOVE');
            } catch (error) {
                logger.sysEvent.error(`Failed to run updateStoredChannels() of type "REMOVE": ${error}`);
            }
        }
        return;
    },
} as Event;
