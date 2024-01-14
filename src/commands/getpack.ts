import { Command } from '../utils/interfaces';
import { ijtapiService } from '../services/IjtApiService';

export const command = {
    name: 'getpack',
    permission: 'MODERATOR',
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Too many arguments. Try again!',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const api = await ijtapiService.getModpack(opts.args[0]);
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

            pack.launcher || pack.link ? `Found here: ${pack.link}` : '',
        ].join(' ');

        await opts.chatClient.say(opts.channel, msg);
        return;
    },
} as Command;
