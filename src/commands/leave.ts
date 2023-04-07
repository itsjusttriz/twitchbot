import { isOwner } from "../utils/check-command-permissions.js";
import { Command } from "../utils/interfaces/Command.js";
import { Permissions } from "../utils/enums/permissions-type.js";

export const command = {
    name: 'leave',
    permission: Permissions.OWNER,
    requiresInput: true,

    run: async opts => {
        /**
         * Check if the command runner is the bot owner. If yes, leave following channels.
         *  If not, check if command runner is the caster. If yes, leave user's channel.
         *  Else, run process on an empty channel array, so nothing happens.
         */
        const channelsToLeave = isOwner(opts.tags)
            ? opts.args
            : (
                opts.user === opts.channel.replaceAll('#', '')
                    ? [opts.user]
                    : []
            );

        if (!channelsToLeave && !opts.msgText) {
            opts.chatClient.say(opts.channel, 'No channel(s) detected. Try again!');
            return;
        }

        for (const c of channelsToLeave) {
            opts.chatClient.part(c)
                .then(async c => {
                    opts.chatClient.say(opts.channel, `@${opts.user} -> Leaving ${c}`);
                })
                .catch(async e => {
                    console.warn(`[Error] Failed to leave ${c}: ` + e);
                    opts.chatClient.say(opts.channel, 'Failed to leave channel: ' + c);
                });
        }
        return;
    }
} as Command;