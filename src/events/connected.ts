import { IJTTwitchClient } from "../utils/auth-provider";

export default {
    name: 'connected',
    once: true,
    run: async (address: string, port: number, client: IJTTwitchClient) => {
        console.log('Connected!')
        console.table([{ address, port }]);

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