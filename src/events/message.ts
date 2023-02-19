import { ChatUserstate } from "tmi.js";
import { IJTTwitchClient } from "../utils/auth-provider.js";
import { hasPermission } from "../utils/check-command-permissions.js";
import { CommandOptions } from "../utils/command-options.js";

export default {
    name: 'message',
    once: false,

    run: async (channel: string, tags: ChatUserstate, msg: string, self: boolean, client: IJTTwitchClient) => {

        // ? Improve this.
        console.log([channel, self ? 'SELF' : '@' + tags['username'], msg].join(' | '));

        if (self || !msg.startsWith('!'))
            return;

        if (tags['message-type'] === 'whisper') {
            (await client.getChatClient()).whisper(tags.username, 'Commands are not functional via whispers. Please try again, in a mutually connected channel.').catch(e => {
                console.warn(`Failed to whisper ${tags.username}: ` + e);
            });
            return;
        }

        const opts = new CommandOptions(channel, tags, msg, self, client);
        const cmd = client.commands.get(opts.command);

        if (cmd?.name !== opts.command)
            return;
        if (!hasPermission(tags, cmd.permission))
            return;

        cmd.run(opts);
    }
}