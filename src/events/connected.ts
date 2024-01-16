import { joinChannelsOnStartup } from '../helper/JoinChannelOnStartupHelper';
import { Event } from '../utils/interfaces/Event';
import { logger } from '../utils/Logger';

export const event = {
    name: 'connected',
    once: true,
    run: async (client, address: string, port: string) => {
        logger.sysEvent.success(`Connected to ${address} - ${port}`);

        if (client.config.DEBUG_MODE) {
            await client.chat.join(client.config.DEBUG_CHANNEL);
            return;
        }

        await joinChannelsOnStartup(client).catch((e) => {
            logger.sysEvent.error(`Failed to run joinChannels(): ${e}`);
        });
        return;
    },
} as Event;
