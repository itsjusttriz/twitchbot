import { ITime } from "@itsjusttriz/utils";
import { ChatUserstate } from "tmi.js";
import { IJTTwitchClient } from "../controllers/IJTClient.js";
import { hasPermission } from "../utils/check-command-permissions.js";
import { MessageOptions } from "../utils/MessageOptions.js";
import { Event } from "../utils/interfaces/Event.js";

export const event = {
    name: 'message',
    once: false,

    run: async (channel: string, tags: ChatUserstate, msg: string, self: boolean, client: IJTTwitchClient) => {
        const { chat } = client;

        // ? Improve this.
        console.log([
            ITime.formatNow('short'),
            client.settings.debug ? '[DEBUG-MODE]' : '',
            channel,
            self ? 'SELF' : '@' + tags['username'],
            msg
        ].join(' | '));

        if (self || !msg.startsWith('!'))
            return;

        const opts = new MessageOptions(channel, tags, msg, self, client);
        const cmd = client.commands.get(opts.command);

        if (cmd?.name !== opts.command)
            return;
        if (!hasPermission(tags, cmd.permission))
            return;
        if (cmd?.blacklisted_channels?.length && cmd?.blacklisted_channels?.includes(channel.replaceAll('#', '')))
            return;
        if (cmd?.whitelisted_channels?.length && !cmd?.whitelisted_channels?.includes(channel.replaceAll('#', '')))
            return;
        if (cmd?.whitelisted_users && !cmd?.whitelisted_users.includes(opts.user))
            return;

        if (cmd?.requiresInput && !opts.msgText) {
            chat.say(opts.channel, `${opts.user} -> This command requires input. Try again!`);
            return;
        }

        if (cmd?.maxArgs && opts.args.length > cmd.maxArgs) {
            chat.say(opts.channel, `${opts.user} -> ${cmd.maxArgsErrorMessage || 'Too many arguments. Try again!'}`);
            return;
        }

        cmd.run(opts);
    }
} as Event;