import { ClientController } from "../controllers/client.controller";
import { LogPrefixes, logger } from "../utils/Logger";
import { getJoinableChannels } from "../utils/sqlite";

const DEFAULT_CHANNELS = ['itsjusttriz', 'ijtdev'];

export async function joinChannelsOnStartup(client: typeof ClientController) {
    const { chat } = client;

    let storedChannels = await getJoinableChannels().catch(e => {
        logger.setPrefix(LogPrefixes.DATABASE).error(`Failed to run getJoinableChannels(): ${e}`);
        return;
    });

    const channels = !storedChannels || !storedChannels.length
        ? DEFAULT_CHANNELS
        : storedChannels.map((doc: { name: string; }) => doc.name);

    for (const channel of channels) {
        await chat.join(channel).catch(e => {
            logger.setPrefix(LogPrefixes.CHAT_MESSAGE).error(`Failed to join ${channel}: ${e}`)
        });
    }
}