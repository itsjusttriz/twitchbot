import { heartsDb } from '../controllers/DatabaseController/HeartEmotesDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'togglehearts',
    aliases: [],
    permission: 'OWNER',
    requiresInput: true,
    minArgs: 2,
    min_args_error_message: 'Usage: !togglehearts <channel> <true/false>',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        try {
            const [_channel, ...extraText] = opts.args;

            const query = await heartsDb
                .toggleChannelEmotes(_.dehashChannel(_channel), extraText[0] === 'true')
                .catch(_.quickCatch);
            if (!query) {
                throw 'Failed to toggle heart emotes.';
            }
            if (!query.changes) {
                throw 'Nothing changed.';
            }

            await opts.chatClient.say(
                opts.channel,
                `Toggled all hearts from channel (${_channel}) to ${extraText[0]}.`
            );
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(opts.channel, error);
        }
    },
} as Command;
