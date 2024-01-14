import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'join',
    permission: 'OWNER',
    requiresInput: true,
    blacklisted_channels: ['stackupdotorg'],

    run: async (opts) => {
        const list = [...new Set(opts.args)];
        const callbacks = list.map((c) => opts.chatClient.join(c));
        const promises = await Promise.allSettled(callbacks);

        const fulfilled = promises
            .filter((promise) => promise.status === 'fulfilled')
            .map((f) => f['value'])
            .flat(Infinity)
            .map((c) => _.dehashChannel(c));
        const rejectedChans = list.filter((c) => !fulfilled.includes(c));

        logger.sysChat.error('Failed - JOIN - Channels: ' + JSON.stringify(rejectedChans, null, 4));
        logger.sysChat.success('Success - JOIN - Channels: ' + JSON.stringify(fulfilled, null, 4));

        await opts.chatClient.say(
            opts.channel,
            `Joined ${fulfilled.length} / ${opts.args.length} channels.` +
                (!rejectedChans.length ? '' : ' Failed channels have been recorded.')
        );

        return;
    },
} as Command;
