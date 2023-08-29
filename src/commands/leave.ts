import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { isOwner } from '../utils/check-command-permissions';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'leave',
    aliases: ['part'],
    permission: Permissions.CASTER,
    requiresInput: true,

    run: async (opts) => {
        const isCaster = opts.user === opts.dehashedChannel;
        const caster = isCaster ? [opts.user] : [];
        const list = isOwner(opts.tags) ? [...new Set(opts.args)] : caster;

        const callbacks = list.map((c) => opts.chatClient.part(c));
        const promises = await Promise.allSettled(callbacks);

        const fulfilled = promises
            .filter((promise) => promise.status === 'fulfilled')
            .map((f) => f['value'])
            .flat(Infinity)
            .map((c) => _.dehashChannel(c));
        const rejectedChans = list.filter((c) => !fulfilled.includes(c));

        logger.sysChat.error('Failed - PART - Channels: ' + JSON.stringify(rejectedChans, null, 4));
        logger.sysChat.success('Success - PART - Channels: ' + JSON.stringify(fulfilled, null, 4));

        await opts.chatClient.say(
            opts.channel,
            `Left ${fulfilled.length} / ${opts.args.length} channels.` +
                (!rejectedChans.length ? '' : ' Failed channels have been recorded.')
        );

        return;
    },
} as Command;
