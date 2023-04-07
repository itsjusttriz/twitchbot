import { joinChannelsOnStartup } from "../helper/join-channels-on-startup";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";

export const event = {
    name: 'connected',
    once: true,
    run: async (address: string, port: number, client: IJTTwitchClient) => {
        console.log('Connected!')
        console.table([{ address, port }]);

        if (client.settings.debug)
            client.chat.join('itsjusttriz');
        else
            await joinChannelsOnStartup(client).catch(e => {
                console.warn(`[Error] Failed to run joinChannels(): ` + e);
            });
        return;
    }
} as Event;