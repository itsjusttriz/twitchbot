import { updateStoredChannels } from '../helper/UpdateStoredChannelsHelper';
import { _ } from '../utils';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'part',
    once: false,

    run: async (client, channel: string, username: string, self: boolean) => {
        if (!self) return;

        if (client.config.DEBUG_MODE) client.chat.say(client.config.DEBUG_CHANNEL, `Left ${channel}`);

        logger.sysEvent.info(`Left ${channel}`);

        if (!client.config.DEBUG_MODE) {
            try {
                await updateStoredChannels(_.dehashChannel(channel), 'remove');
            } catch (error) {
                logger.sysEvent.error(`Failed to update stored channels in 'PART' event: ${error}`);
            }
        }
        return;
    },
} as Event;
