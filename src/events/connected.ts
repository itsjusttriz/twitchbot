import { joinChannelsOnStartup } from "../helper/join-channels-on-startup";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";
import { LogPrefixes, logger } from "../utils/Logger";

export const event = {
    name: 'connected',
    once: true,
    run: async (address: string, port: number, client: IJTTwitchClient) => {
        logger
            .setPrefix(LogPrefixes.CHAT_MESSAGE)
            .success(`Connected to ${address} - ${port}`)

        if (client.settings.debug)
            client.chat.join('itsjusttriz');
        else
            await joinChannelsOnStartup(client).catch(e => {
                logger
                    .setPrefix(LogPrefixes.COLORED_EVENTS)
                    .error(`Failed to run joinChannels():${e}`);
            });
        return;
    }
} as Event;