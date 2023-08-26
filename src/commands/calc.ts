import { decApi } from '../services/decapi.service';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'calc',
    aliases: ['math'],
    permission: Permissions.MODERATOR,
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Calculations must not be space-seperated. eg. 2+2 instead of 2 + 2',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        try {
            const result = await decApi.calculate(opts.args[0]);
            if (!result) {
                logger.svcDecApi.error('Something went wrong?');
                await opts.chatClient.say(opts.channel, 'Something went wrong?');
            }
            await opts.chatClient.say(opts.channel, result);
        } catch (error) {
            logger.svcDecApi.error('Something went wrong?', error);
            await opts.chatClient.say(opts.channel, 'Something went wrong? An error has been recorded.');
        }
        return;
    },
} as Command;
