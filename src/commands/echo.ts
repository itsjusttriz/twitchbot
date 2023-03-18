import { CommandOptions } from "../utils/command-options.js"
import { Permissions } from "../utils/types/permissions-type.js";

export default {
    name: 'echo',
    blacklisted_channels: ['stackupdotorg'],
    permission: Permissions.OWNER,


    run: async (opts: CommandOptions) => {
        if (!opts.msgText) {
            (await opts.getChatClient()).say(opts.channel, 'No msgText detected. Try again!');
            return;
        }

        (await opts.getChatClient()).say(opts.channel, opts.msgText);
        return;
    }
}