import { addChannelToStoredChannels, updateBlacklistedChannels } from '../utils/sqlite';
import { AddOrRemoveChannel } from '../utils/constants';
import { logger } from '../utils/Logger';

export async function updateStoredChannels(channel: string, action: keyof typeof AddOrRemoveChannel) {
    const actions = {
        [AddOrRemoveChannel.ADD]: async () => await addChannelToStoredChannels(channel),
        [AddOrRemoveChannel.REMOVE]: async () => await updateBlacklistedChannels(channel, true),
    };

    try {
        return await actions[action.toLowerCase()]();
    } catch (error) {
        return handleError(action, error);
    }
}

function handleError(action: string, e): unknown {
    logger.db.error(`Failed to update STORED_CHANNELS (action: ${action}): ${e}`);
    return;
}
