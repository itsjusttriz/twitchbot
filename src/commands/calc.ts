import { CommandOptions } from "../utils/command-options.js";
import { Permissions } from "../utils/types/permissions-type.js";
import { mathApi } from "../services/decapi/math.js";

export default {
    name: 'calc',
    blacklisted_channels: ['stackupdotorg'],
    permission: Permissions.MODERATOR,

    run: async (opts: CommandOptions) => {
        if (!opts.msgText) {
            (await opts.getChatClient()).say(opts.channel, 'No expression detected. Try again!');
            return;
        }

        if (opts.args.length > 1) {
            (await opts.getChatClient()).say(opts.channel, 'Calculations must not be space-seperated. eg. 2+2 instead of 2 + 2');
            return;
        }

        mathApi(opts.args[0])
            .then(async res => (await opts.getChatClient()).say(opts.channel, res))
            .catch(e => {
                console.warn(`[Error] Failed to run mathApi(): ` + e);
            });
        return;
    }
}