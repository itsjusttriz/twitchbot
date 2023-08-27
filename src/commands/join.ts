import { Command } from '../utils/interfaces';
import { Permissions } from '../utils/constants';
import { logger } from '../utils/Logger';
import { dehashChannel } from '../helper/dehash-channels';

export const command = {
    name: 'join',
    permission: Permissions.OWNER,
    requiresInput: true,
    blacklisted_channels: ['stackupdotorg'],

    run: async (opts) => {
        const callbacks = opts.args.map((c) => opts.chatClient.join(c));
        const promises = await Promise.allSettled(callbacks);

        const fulfilled = promises
            .filter((promise) => promise.status === 'fulfilled')
            .map((f) => f['value'])
            .flat(Infinity)
            .map((c) => dehashChannel(c));
        const rejectedChans = opts.args.filter((c) => !fulfilled.includes(c));

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
