import { updateStoredChannels } from "../helper/update-stored-channels";
import { IJTTwitchClient } from "../utils/auth-provider";

export default {
    name: 'part',
    once: false,

    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        // (await client.getChatClient()).say('itsjusttriz', `Joined ${channel}`);
        console.info('Left', channel);

        await updateStoredChannels(channel.replace('#', ''), 'REMOVE').catch(e => {
            console.warn(`[Error] Failed to run updateStoredChannels()#REMOVE: ` + e);
        });
        return;
    }
}