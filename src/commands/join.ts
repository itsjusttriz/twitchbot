import { CommandOptions } from "../utils/command-options.js";
import { Permissions } from "../utils/types/permissions-type.js";

export default {
    name: 'join',
    blacklisted_channels: ['stackupdotorg'],
    permission: Permissions.OWNER,

    run: async (opts: CommandOptions) => {
        if (!opts.msgText) {
            (await opts.getChatClient()).say(opts.channel, 'No channel(s) detected. Try again!');
            return;
        }

        for (const c of opts.args) {
            (await opts.getChatClient()).join(c)
                .then(async c => {
                    (await opts.getChatClient()).say(opts.channel, `@${opts.user} -> Joining ${c}`);
                })
                .catch(async e => {
                    console.warn(`[Error] Failed to join ${c}: ` + e);
                    (await opts.getChatClient()).say(opts.channel, 'Failed to join channel: ' + c)
                });
        }
        return;
    }
}