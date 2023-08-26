import { dehashChannel } from '../helper/dehash-channels';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { addHeartEmote, removeHeartEmote, toggleHeartEmotesByChannel } from '../utils/sqlite';

export const command = {
    name: 'edithearts',
    aliases: [],
    minArgs: 3,
    min_args_error_message: 'Usage: !edithearts <option> <channel> <....hearts>',
    permission: Permissions.OWNER,
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const [option, _channel, ...extraText] = opts.args;
        if (!option) {
            await opts.chatClient.say(opts.channel, "Parameter 'option' is required.");
            return;
        }

        if (!['+', 'add', '-', 'remove'].includes(option.toLowerCase())) {
            await opts.chatClient.say(
                opts.channel,
                "Parameter 'option' must be one of the following: +, add, -, remove"
            );
            return;
        }

        const channel = dehashChannel(_channel);

        let succeeded = [];
        let failed = [];

        switch (option.toLowerCase()) {
            case '+':
            case 'add':
                for (const heart of extraText) {
                    const stmt = await addHeartEmote(channel, heart).catch((e) => {
                        if (!failed.includes(heart)) failed.push(heart);
                        logger.sysDebug.error(e);
                        return { changes: 0 };
                    });
                    if (!stmt.changes) {
                        if (!failed.includes(heart)) failed.push(heart);
                    } else {
                        if (!succeeded.includes(heart)) succeeded.push(heart);
                    }
                }
                break;

            case '-':
            case 'remove':
                for (const heart of extraText) {
                    const stmt = await removeHeartEmote(heart).catch((e) => {
                        if (!failed.includes(heart)) failed.push(heart);
                        logger.sysDebug.error(e);
                        return { changes: 0 };
                    });
                    if (!stmt.changes) {
                        if (!failed.includes(heart)) failed.push(heart);
                    } else {
                        if (!succeeded.includes(heart)) succeeded.push(heart);
                    }
                }
                break;
            default: {
                return;
            }
        }

        if (succeeded.length)
            await opts.chatClient.say(
                opts.channel,
                `${['+', 'add'].includes(option.toLowerCase()) ? 'Added' : 'Removed'} hearts (${succeeded.join(
                    ' '
                )}) from channel (${channel}).`
            );
        if (failed.length)
            await opts.chatClient.say(
                opts.channel,
                `Failed to ${['+', 'add'].includes(option.toLowerCase()) ? 'add' : 'remove'} hearts (${failed.join(
                    ' '
                )}) from channel (${channel}).`
            );
        return;
    },
} as Command;
