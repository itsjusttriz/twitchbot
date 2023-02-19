import { joinChannelsOnStartup } from "../helper/join-channels-on-startup";
import { IJTTwitchClient } from "../utils/auth-provider";

export default {
    name: 'connected',
    once: true,
    run: async (address: string, port: number, client: IJTTwitchClient) => {
        console.log('Connected!')
        console.table([{ address, port }]);

        await joinChannelsOnStartup(client).catch(e => {
            console.warn(`[Error] Failed to run joinChannels(): ` + e);
        });
        return;
    }
}