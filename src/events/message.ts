import { ChatUserstate } from 'tmi.js';
import { hasPermission } from '../utils/check-command-permissions.js';
import { MessageOptions } from '../utils/MessageOptions.js';
import { Event } from '../utils/interfaces/Event.js';
import { handleBadJokes } from '../helper/event.message/handlers.badjoke.js';
import { handleMessageLogging } from '../helper/event.message/handlers.logging.js';
import { logger } from '../utils/Logger.js';

const badJokeChannels = new Map<string, boolean>();

export const event = {
    name: 'message',
    once: false,

    run: async (client, channel: string, tags: ChatUserstate, msg: string, self: boolean) => {
        const { chat } = client;
        const opts = new MessageOptions(channel, tags, msg, self, client);

        // ? Improve this.
        const msgLog = await handleMessageLogging(opts);
        logger[client.settings.debug.enabled ? 'sysDebug' : 'sysChat'].log(undefined, msgLog);

        await handleBadJokes(opts, badJokeChannels);

        if (self || !msg.startsWith(client.settings.prefix)) return;

        const cmd = client.commands.get(opts.command);
        if (!cmd) return;

        const isValidCommandName = cmd.name === opts.command || cmd.aliases?.includes(opts.command);
        if (!isValidCommandName) return;

        if (!hasPermission(tags, cmd.permission)) return;
        if (cmd.blacklisted_channels?.length && cmd.blacklisted_channels?.includes(opts.dehashedChannel)) return;
        if (
            cmd.whitelisted_channels?.length &&
            !cmd.whitelisted_channels?.includes(opts.dehashedChannel) &&
            opts.dehashedChannel !== client.settings.debug.logChannel
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

        if (client.settings.isMuted && !cmd.isUnmutable) return;
        cmd.run(opts);
    },
} as Event;
