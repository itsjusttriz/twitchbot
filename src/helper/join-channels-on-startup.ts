import { ClientController } from '../controllers/client.controller';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { getJoinableChannels } from '../utils/sqlite';

const DEFAULT_CHANNELS = ['itsjusttriz', 'ijtdev'];

export async function joinChannelsOnStartup(client: typeof ClientController) {
    let storedChannels = await getJoinableChannels().catch((e) => {
        logger.db.error(`Failed to run getJoinableChannels(): ${e}`);
        return [];
    });

    const channels = !storedChannels.length
        ? DEFAULT_CHANNELS
        : storedChannels.map(({ name: channel }: { name: string }) => channel);

    const mappedToJoin = channels.map((c) => client.chat.join(c));
    const promises = await Promise.allSettled(mappedToJoin);

    const fulfilled = promises
        .filter((promise) => promise.status === 'fulfilled')
        .map((f) => f['value'])
        .flat(Infinity)
        .map((c) => _.dehashChannel(c));
    const rejectedChans = channels.filter((c) => !fulfilled.includes(c));

    if (client.settings.debug.enabled) {
        logger.sysChat.error('Failed - JOIN - Channels: ' + JSON.stringify(rejectedChans, null, 4));
        logger.sysChat.success('Success - JOIN - Channels: ' + JSON.stringify(fulfilled, null, 4));
    }
}
