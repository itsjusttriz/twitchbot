import { heartsDb } from '../controllers/DatabaseController/HeartEmotesDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'edithearts',
    aliases: [],
    minArgs: 3,
    min_args_error_message: 'Usage: !edithearts <option> <channel> <....hearts>',
    permission: 'OWNER',
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
                        const stmt = await heartsDb.addEmote(channel, heart).catch((e) => ({ changes: 0 }));
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
                        const stmt = await heartsDb.removeEmote(heart).catch((e) => ({ changes: 0 }));
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
