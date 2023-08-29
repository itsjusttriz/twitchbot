import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { addHeartEmote, removeHeartEmote } from '../utils/sqlite';

export const command = {
    name: 'edithearts',
    aliases: [],
    minArgs: 3,
    min_args_error_message: 'Usage: !edithearts <option> <channel> <....hearts>',
    permission: Permissions.OWNER,
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const [option, _channel, ...extraText] = opts.args;

        if (!['+', 'add', '-', 'remove'].includes(option.toLowerCase())) {
            await opts.chatClient.say(
                opts.channel,
                "Parameter 'option' must be one of the following: +, add, -, remove"
            );
            return;
        }

        const channel = _.dehashChannel(_channel);
        let succeeded = new Set<string>();
        let failed = new Set<string>();

        switch (option.toLowerCase()) {
            case '+':
            case 'add':
                for (const heart of extraText) {
                    try {
                        const stmt = await addHeartEmote(channel, heart).catch((e) => ({ changes: 0 }));
                        !stmt.changes ? failed.add(heart) : succeeded.add(heart);
                    } catch (error) {
                        logger.sysDebug.error(error);
                        failed.add(heart);
                    }
                }
                break;

            case '-':
            case 'remove':
                for (const heart of extraText) {
                    try {
                        const stmt = await removeHeartEmote(heart).catch((e) => ({ changes: 0 }));
                        !stmt.changes ? failed.add(heart) : succeeded.add(heart);
                    } catch (error) {
                        logger.sysDebug.error(error);
                        failed.add(heart);
                    }
                }
                break;
            default: {
                return;
            }
        }

        const optionIsToAdd = ['+', 'add'].includes(option.toLowerCase());
        if (succeeded.size)
            await opts.chatClient.say(
                opts.channel,
                `${optionIsToAdd ? 'Added' : 'Removed'} hearts (${[...succeeded].join(' ')}) from channel (${channel}).`
            );
        if (failed.size)
            await opts.chatClient.say(
                opts.channel,
                `Failed to ${optionIsToAdd ? 'add' : 'remove'} hearts (${[...failed].join(
                    ' '
                )}) from channel (${channel}).`
            );
        return;
    },
} as Command;
