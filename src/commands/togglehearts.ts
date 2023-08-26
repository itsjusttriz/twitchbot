import { dehashChannel } from '../helper/dehash-channels';
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
        const channel = dehashChannel(_channel);

        const stmt = await toggleHeartEmotesByChannel(channel, extraText[0] === 'true').catch(async (e) => {
            logger.sysDebug.error(e);
            return { changes: 0 };
        });

        if (!stmt.changes)
            await opts.chatClient.say(opts.channel, `No heart emotes found for this channel (${channel}).`);
        else
            await opts.chatClient.say(opts.channel, `Toggled all hearts from channel (${channel}) to ${extraText[0]}.`);
        return;
    },
} as Command;
