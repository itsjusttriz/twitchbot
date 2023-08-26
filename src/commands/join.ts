import { Command } from '../utils/interfaces';
import { Permissions } from '../utils/constants';
import { logger } from '../utils/Logger';

export const command = {
    name: 'join',
    permission: Permissions.OWNER,
    requiresInput: true,
    blacklisted_channels: ['stackupdotorg'],

    run: async (opts) => {
        const callbacks = opts.args.map((c) => opts.chatClient.join(c));
        const promises = await Promise.allSettled(callbacks);

        const fulfilled = promises.filter((promise) => promise.status === 'fulfilled');
        const rejected = promises.filter((promise) => promise.status === 'rejected');

        logger.sysChat.error('Failed - JOIN - Channels: ', rejected);
        logger.sysChat.success('Success - JOIN - Channels: ', fulfilled);

        return;
    },
} as Command;
