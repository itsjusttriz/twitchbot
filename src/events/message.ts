import { ChatUserstate } from 'tmi.js';
import { hasPermission } from '../helper/CommandPermissionCheck.js';
import { MessageOptions } from '../utils/MessageOptions.js';
import { Event } from '../utils/interfaces/Event.js';
import { handleBadJokes } from '../helper/event.message/custom.BadJokeHelper.js';
import { handleMessageLogging } from '../helper/event.message/LoggerHelper.js';
import { logger } from '../utils/Logger.js';
import { Permissions } from '../utils/constants';

const badJokeChannels = new Map<string, boolean>();

export const event = {
    name: 'message',
    once: false,

    run: async (client, channel: string, tags: ChatUserstate, msg: string, self: boolean) => {
        const { chat } = client;
        const opts = new MessageOptions(channel, tags, msg, self, client);

        // ? Improve this.
        const msgLog = await handleMessageLogging(opts);
        logger.sysChat.log(undefined, msgLog);

        await handleBadJokes(opts, badJokeChannels);

        if (self || !msg.startsWith(client.config.COMMAND_PREFIX)) return;

        const cmd = client.commands.get(opts.command);
        if (!cmd) return;

        const isValidCommandName = cmd.name === opts.command || cmd.aliases?.includes(opts.command);
        if (!isValidCommandName) return;

        if (!hasPermission(tags, Permissions[cmd.permission])) return;
        if (cmd.blacklisted_channels?.length && cmd.blacklisted_channels?.includes(opts.dehashedChannel)) return;
        if (
            cmd.whitelisted_channels?.length &&
            !cmd.whitelisted_channels?.includes(opts.dehashedChannel) &&
            opts.dehashedChannel !== client.config.DEBUG_CHANNEL
        )
            return;
        if (cmd.whitelisted_users && !cmd.whitelisted_users.includes(opts.user)) return;

        if (cmd.requiresInput && !opts.msgText) {
            await chat.say(opts.channel, `${opts.user} -> This command requires input. Try again!`);
            return;
        }

        if (cmd.minArgs && opts.args.length < cmd.minArgs) {
            await chat.say(
                opts.channel,
                `${opts.user} -> ${cmd.min_args_error_message || 'Not enough arguments. Try again!'}`
            );
            return;
        }

        if (cmd.maxArgs && opts.args.length > cmd.maxArgs) {
            await chat.say(
                opts.channel,
                `${opts.user} -> ${cmd.max_args_error_message || 'Too many arguments. Try again!'}`
            );
            return;
        }

        if (client.config.IS_MUTED && !cmd.isUnmutable) return;
        cmd.run(opts);
    },
} as Event;
