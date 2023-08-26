import { addChannelToStoredChannels, updateBlacklistedChannels } from '../utils/sqlite';
import { AddOrRemoveChannel } from '../utils/constants';
import { logger } from '../utils/Logger';

export async function updateStoredChannels(channel: string, action: keyof typeof AddOrRemoveChannel) {
    switch (AddOrRemoveChannel[action]) {
        case AddOrRemoveChannel.ADD: {
            await addChannelToStoredChannels(channel).catch((e) => handleError(action, e));
            break;
        }
        case AddOrRemoveChannel.REMOVE: {
            await updateBlacklistedChannels(channel, true).catch((e) => handleError(action, e));
            break;
        }
        default: {
            break;
        }
    }
    return;
}

function handleError(action: string, e): unknown {
    logger.db.error(`Failed to update STORED_CHANNELS (action: ${action}): ${e}`);
    return;
}
