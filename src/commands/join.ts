import { Command } from "../utils/interfaces/Command.js";
import { Permissions } from "../utils/enums/permissions-type.js";
import { logger } from "../utils/logger.js";

export const command = {
    name: 'join',
    permission: Permissions.OWNER,
    requiresInput: true,
    blacklisted_channels: ['stackupdotorg'],

    run: async opts => {
        if (!opts.msgText) {
            opts.chatClient.say(opts.channel, 'No channel(s) detected. Try again!');
            return;
        }

        for (const c of opts.args) {
            opts.chatClient.join(c)
                .then(async c => {
                    opts.chatClient.say(opts.channel, `@${opts.user} -> Joining ${c}`);
                })
                .catch(async e => {
                    logger
                        .setPrefix('[Chat/Commands]')
                        .error(`Failed to join ${c}:`, e);
                    opts.chatClient.say(opts.channel, 'Failed to join channel: ' + c)
                });
        }
        return;
    }
} as Command;