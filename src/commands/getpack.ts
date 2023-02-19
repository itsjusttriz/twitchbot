import { getPackFromApi } from "../services/ijt-api/get-modpack.js";
import { CommandOptions } from "../utils/command-options.js";
import { Permissions } from "../utils/types/permissions-type.js";

export default {
    name: 'getpack',
    permission: Permissions.MODERATOR,

    run: async (opts: CommandOptions) => {
        if (!opts.msgText) {
            (await opts.getChatClient()).say(opts.channel, 'No id detected. Try again!');
            return;
        }

        if (opts.args.length > 1) {
            (await opts.getChatClient()).say(opts.channel, 'Too many arguments. Try again!');
            return;
        }


        const pack = await getPackFromApi(opts.args[0]);
        if (!pack) {
            (await opts.getChatClient()).say(opts.channel, 'Failed to fetch this modpack.');
            return;
        }

        const msg = [
            `Requested modpack is called ${pack.name}.`,
            `Created by ${pack.dev}.`,
            `Known Status: ${pack.type}.`,

            (pack.launcher || pack.link) ? `Found here: ${pack.link}` : ''
        ].join(' ');

        (await opts.getChatClient()).say(opts.channel, msg);
        return;
    }
}