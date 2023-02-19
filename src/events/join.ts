import { updateStoredChannels } from "../helper/update-stored-channels";
import { IJTTwitchClient } from "../utils/auth-provider";

export default {
    name: 'join',
    once: false,

    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        // (await client.getChatClient()).say('itsjusttriz', `Joined ${channel}`);
        console.info('Joined', channel);

        await updateStoredChannels(channel.replace('#', ''), 'ADD').catch(e => {
            console.warn(`[Error] Failed to run updateStoredChannels()#ADD: ` + e);
        })
        return;
    }
}