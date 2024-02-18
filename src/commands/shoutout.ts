import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'shoutout',
    aliases: ['so'],
    permission: 'OWNER',
    requiresInput: true,
    minArgs: 1,
    whitelisted_channels: ['itsjusttriz'],
    run: async (opts) => {
        try {
            await opts.client.experimental_sendShoutout(opts.tags['room-id'], opts.args[0]);
        } catch (error) {
            await opts.chatClient.say(opts.channel, 'Failed to perform /shoutout command.');
        }
    },
} as Command;
