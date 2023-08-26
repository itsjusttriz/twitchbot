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

        for (const channel of list) {
            const parted = await opts.chatClient.part(channel).catch(async (e) => {
                logger.sysChat.error(`Failed to leave ${channel}: ${e}`);
                await opts.chatClient.say(opts.channel, `Failed to leave channel: ${channel}`);
            });
            await opts.chatClient.say(opts.channel, `@${opts.user} -> Leaving ${parted}`);
        }
        return;
    },
} as Command;
