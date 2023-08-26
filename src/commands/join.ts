import { Command } from '../utils/interfaces';
import { Permissions } from '../utils/constants';
import { logger } from '../utils/Logger';

export const command = {
    name: 'join',
    permission: Permissions.OWNER,
    requiresInput: true,
    blacklisted_channels: ['stackupdotorg'],

    run: async (opts) => {
        for (const c of opts.args) {
            const joined = await opts.chatClient.join(c).catch(async (e) => {
                logger.sysChat.error(`Failed to join ${c}: ${e}`);
                await opts.chatClient.say(opts.channel, `Failed to join channel: ${c}`);
            });
            await opts.chatClient.say(opts.channel, `@${opts.user} -> Joining ${joined}`);
        }
        return;
    },
} as Command;
