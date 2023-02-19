import { CommandOptions } from "../utils/command-options.js";
import { Permissions } from "../utils/types/permissions-type.js";

export default {
    name: 'epoch',
    permission: Permissions.REGULAR,

    run: async (opts: CommandOptions) => {
        if (!opts.msgText) {
            (await opts.getChatClient()).say(opts.channel, 'No msgText detected. Try again!');
            return;
        }

        const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

        if (!regex.test(opts.msgText)) {
            (await opts.getChatClient()).say(opts.channel, 'Invalid Timestamp. Format must be: yyyy-mm-ddTHH:MM');
            return;
        }

        const epoch = new Date(opts.msgText).getTime() / 1000;
        (await opts.getChatClient()).say(opts.channel, epoch.toString());
        return;
    }
}