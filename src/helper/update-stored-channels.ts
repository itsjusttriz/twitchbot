import { addChannelToStoredChannels, updateBlacklistedChannels } from "../utils/sqlite";
import { AddOrRemoveChannel } from "../utils/types/add-or-remove-channel";

export async function updateStoredChannels(channel: string, action: keyof typeof AddOrRemoveChannel) {

    switch (AddOrRemoveChannel[action]) {
        case AddOrRemoveChannel.ADD: {
            await addChannelToStoredChannels(channel).catch(e => handleError(action, e));
            break;
        }
        case AddOrRemoveChannel.REMOVE: {
            await updateBlacklistedChannels(true, channel).catch(e => handleError(action, e));
            break;
        }
        default: {
            return;
        }
    }

    return;
}

function handleError(action: string, e): unknown {
    console.warn(`[Error] Failed to update STORED_CHANNELS (action: ${action}): ` + e);
    return;
}