import { isCasterOrAbove, isOwner } from "../utils/check-command-permissions.js";
import { CommandOptions } from "../utils/command-options.js"
import { Permissions } from "../utils/types/permissions-type.js";

export default {
    name: 'leave',
    permission: Permissions.OWNER,

    run: async (opts: CommandOptions) => {
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
            (await opts.getChatClient()).say(opts.channel, 'No channel(s) detected. Try again!');
            return;
        }

        for (const c of channelsToLeave) {
            (await opts.getChatClient()).part(c)
                .then(async c => {
                    (await opts.getChatClient()).say(opts.channel, `@${opts.user} -> Leaving ${c}`);
                })
                .catch(async e => {
                    console.warn(`[Error] Failed to leave ${c}: ` + e);
                    (await opts.getChatClient()).say(opts.channel, 'Failed to leave channel: ' + c);
                });
        }
        return;
    }
}