import { getPackFromApi } from "../services/ijt-api/get-modpack.js";
import { Command } from "../utils/interfaces/Command.js";
import { Permissions } from "../utils/enums/permissions-type.js";

export const command = {
    name: 'getpack',
    permission: Permissions.MODERATOR,
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Too many arguments. Try again!',
    blacklisted_channels: ['stackupdotorg'],
    run: async opts => {
        if (!opts.msgText) {
            opts.chatClient.say(opts.channel, 'No id detected. Try again!');
            return;
        }

        const pack = await getPackFromApi(opts.args[0]);
        if (!pack) {
            opts.chatClient.say(opts.channel, 'Failed to fetch this modpack.');
            return;
        }

        const msg = [
            `Requested modpack is called ${pack.name}.`,
            `Created by ${pack.dev}.`,
            `Known Status: ${pack.type}.`,

            (pack.launcher || pack.link) ? `Found here: ${pack.link}` : ''
        ].join(' ');

        opts.chatClient.say(opts.channel, msg);
        return;
    }
} as Command;