import { channelsDb } from '../controllers/DatabaseController/ChannelConnectionDatabaseController';
import { _ } from '../utils';

export async function updateStoredChannels(channel: string, action: 'add' | 'remove') {
    const actions = {
        add: async () => await channelsDb.storeChannel(channel),
        remove: async () => await channelsDb.updateBlacklist(channel, true),
    };

    try {
        return await actions[action]();
    } catch (error) {
        return _.quickCatch(error);
    }
}
