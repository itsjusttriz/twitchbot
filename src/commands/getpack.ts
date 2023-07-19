import { Command } from "../utils/interfaces";
import { Permissions } from "../utils/constants";
import { IjtApi } from "../services/ijt.api.service";

export const command = {
    name: 'getpack',
    permission: Permissions.MODERATOR,
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Too many arguments. Try again!',
    blacklisted_channels: ['stackupdotorg'],
    run: async opts => {
        const api = await IjtApi.getModpack(opts.args[0]);
        if (!api) {
            await opts.chatClient.say(opts.channel, `Failed to fetch this modpack.`);
            return;
        }

        if (api.code !== 200) {
            await opts.chatClient.say(opts.channel, `Failed to fetch this modpack -> ${api.message}`);
            return;
        }

        const { payload: pack } = api;
        const msg = [
            `Requested modpack is called ${pack.name}.`,
            `Created by ${pack.dev}.`,
            `Known Status: ${pack.type}.`,

            (pack.launcher || pack.link) ? `Found here: ${pack.link}` : ''
        ].join(' ');

        await opts.chatClient.say(opts.channel, msg);
        return;
    }
} as Command;