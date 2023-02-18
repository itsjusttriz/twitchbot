import { CommandOptions } from "../utils/command-options.js";
import { Permissions } from "../utils/types/permissions-type.js";

export default {
    name: 'join',
    permission: Permissions.OWNER,

    run: async (opts: CommandOptions) => {
        if (!opts.msgText) {
            (await opts.getChatClient()).say(opts.channel, 'No channel(s) detected. Try again!');
            return;
        }

        for (const c of opts.args) {
            (await opts.getChatClient()).join(c)
                .catch(async e => {
                    console.warn(`[Error] Failed to join ${c}: ` + e);
                    (await opts.getChatClient()).say(opts.channel, 'Failed to join channel: ' + c)
                });
        }

        // TODO: Fix `stored`.
        const stored = (() => null)();
        if (!stored) {
            (await opts.getChatClient()).say(opts.channel, 'Failed to store channels.')
        }
        return;
    }
}

// TODO: Change this to use internal sqlite db.
// async function storeChannels(arr) {
//     const qs = new URLSearchParams({ channels: arr.join('|') });
//     const api = await fetch(`https://api.itsjusttriz.com/twitch/twitch-bot-channels?${qs}`, { method: 'POST' });
//     return api.status === 200;
// }