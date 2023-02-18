import { IJTTwitchClient } from "../utils/auth-provider";

export default {
    name: 'connected',
    once: true,
    run: async (address: string, port: number, client: IJTTwitchClient) => {
        [{ address, port }, 'Connected!'].forEach(console.info);

        const channels = ['itsjusttriz', 'trizutils'];
        for (const c of channels) {
            await (await client.getChatClient()).join(c).catch(e => {
                console.warn(`[Error] Failed to join ${c}: ` + e);
            });
        }

        // TODO: Fix this.
        console.warn('[Error] Failed fetching channel-join list from database.');
    }
}