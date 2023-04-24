import { IJTTwitchClient } from "../controllers/IJTClient";
import { LogPrefixes, logger } from "../utils/Logger";
import { getJoinableChannels } from "../utils/sqlite";

const DEFAULT_CHANNELS = ['itsjusttriz', 'trizutils'];

export async function joinChannelsOnStartup(client: IJTTwitchClient) {
    const { chat } = client;

    let storedChannels = await getJoinableChannels().catch(e => {
        logger
            .setPrefix(LogPrefixes.DATABASE)
            .error(`Failed to run getJoinableChannels(): ${e}`);
        return null;
    });

    if (!storedChannels)
        storedChannels = [];
    else
        storedChannels = storedChannels.map((doc: { name: string; }) => doc.name);

    const channels = storedChannels.length < 1 ? DEFAULT_CHANNELS : storedChannels;
    for (const c of channels) {
        chat.join(c).catch(e => {
            logger
                .setPrefix(LogPrefixes.CHAT_MESSAGE)
                .error(`Failed to join ${c}: ${e}`)
        });
    }
}