import { updateStoredChannels } from '../helper/UpdateStoredChannelsHelper';
import { _ } from '../utils';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'join',
    once: false,

    run: async (client, channel: string, username: string, self: boolean) => {
        if (!self) return;

        if (client.settings.debug.enabled) client.chat.say(client.settings.debug.logChannel, `Joined ${channel}`);
        logger.sysEvent.info(`Joined ${channel}`);

        if (!client.settings.debug.enabled) {
            try {
                await updateStoredChannels(_.dehashChannel(channel), 'add');
            } catch (error) {
                logger.sysEvent.error(`Failed to run updateStoredChannels() of type "ADD": ${error}`);
            }
        }
        return;
    },
} as Event;
