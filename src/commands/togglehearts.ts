import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { toggleHeartEmotesByChannel } from '../utils/sqlite';

export const command = {
    name: 'togglehearts',
    aliases: [],
    permission: Permissions.OWNER,
    requiresInput: true,
    minArgs: 2,
    min_args_error_message: 'Usage: !togglehearts <channel> <true/false>',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const [_channel, ...extraText] = opts.args;
        const channel = _.dehashChannel(_channel);

        let hasFoundHearts: boolean;
        try {
            const stmt = await toggleHeartEmotesByChannel(channel, extraText[0] === 'true').catch(async (e) => ({
                changes: 0,
            }));
            hasFoundHearts = !!stmt.changes;
        } catch (error) {
            logger.sysDebug.error(error);
            hasFoundHearts = false;
        }

        let resp = hasFoundHearts
            ? `Toggled all hearts from channel (${channel}) to ${extraText[0]}.`
            : `Failed to find heart emotes for channel (${channel}).`;

        await opts.chatClient.say(opts.channel, resp);
        return;
    },
} as Command;
