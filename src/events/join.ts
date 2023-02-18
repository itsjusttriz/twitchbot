import { IJTTwitchClient } from "../utils/auth-provider";

export default {
    name: 'join',
    once: false,
    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        const chan_config = await getChannelConfig(channel).catch(e => {
            console.warn(`[Error] Failed to run getChannelConfig(): ` + e);
        });

        if (chan_config)
            (await client.getChatClient()).say('itsjusttriz', `Joined ${channel}`);
        console.info('Joined', channel);
    }
}

// TODO: Swap this for SQLite config.
function getChannelConfig(channel: string) {
    return new Promise((res, rej) => rej(`[event.join] Config for ${channel}, not found.`));
}