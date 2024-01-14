import { decapiService } from '../services/DecapiService';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'calc',
    aliases: ['math'],
    permission: 'MODERATOR',
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Calculations must not be space-seperated. eg. 2+2 instead of 2 + 2',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        try {
            const result = await decapiService.calculate(opts.args[0]);
            if (!result) {
                logger.svcDecApi.error('Something went wrong?');
                await opts.chatClient.say(opts.channel, 'Something went wrong?');
            }
            await opts.chatClient.say(opts.channel, result.toString());
        } catch (error) {
            logger.svcDecApi.error('Something went wrong?', error);
            await opts.chatClient.say(opts.channel, 'Something went wrong? An error has been recorded.');
        }
        return;
    },
} as Command;
