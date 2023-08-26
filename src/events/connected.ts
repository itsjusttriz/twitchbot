import { joinChannelsOnStartup } from '../helper/join-channels-on-startup';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'connected',
    once: true,
    run: async (client, address: string, port: string) => {
        logger.sysEvent.success(`Connected to ${address} - ${port}`);

        if (client.settings?.debug.isToggled) {
            await client.chat.join(client.settings.debug.logChannel);
            return;
        }

        await joinChannelsOnStartup(client).catch((e) => {
            logger.sysEvent.error(`Failed to run joinChannels(): ${e}`);
        });
        return;
    },
} as Event;
