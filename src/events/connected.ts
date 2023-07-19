import { joinChannelsOnStartup } from "../helper/join-channels-on-startup";
import { Event } from "../utils/interfaces/Event";
import { LogPrefixes, logger } from "../utils/Logger";

export const event = {
    name: 'connected',
    once: true,
    run: async (client, address: string, port: string) => {
        logger
            .setPrefix(LogPrefixes.CHAT_MESSAGE)
            .success(`Connected to ${address} - ${port}`)

        if (client.settings?.debug.isToggled) {
            await client.chat.join(client.settings.debug.logChannel);
            return;
        }

        await joinChannelsOnStartup(client).catch(e => {
            logger
                .setPrefix(LogPrefixes.EVENTS)
                .error(`Failed to run joinChannels():${e}`);
        });
        return;
    }
} as Event;