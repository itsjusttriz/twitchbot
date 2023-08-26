import { isOwner } from '../utils/check-command-permissions';
import { Command } from '../utils/interfaces';
import { Permissions } from '../utils/constants';
import { logger } from '../utils/Logger';

export const command = {
    name: 'leave',
    permission: Permissions.CASTER,
    requiresInput: true,

    run: async (opts) => {
        const isCaster = opts.user === opts.dehashedChannel;
        const caster = isCaster ? [opts.user] : [];
        const list = isOwner(opts.tags) ? opts.args : caster;

        const callbacks = list.map((c) => opts.chatClient.part(c));
        const promises = await Promise.allSettled(callbacks);

        const fulfilled = promises.filter((promise) => promise.status === 'fulfilled');
        const rejected = promises.filter((promise) => promise.status === 'rejected');

        logger.sysChat.error('Failed - PART - Channels: ', rejected);
        logger.sysChat.success('Success - PART - Channels: ', fulfilled);

        return;
    },
} as Command;
