import { hasPermission } from "../utils/check-command-permissions.js";
import { CommandOptions } from "../utils/command-options.js";
import { ExtendedClient } from "../utils/auth-provider.js";

export default {
    name: 'message',
    once: false,

    /**
     * 
     * @param {string} channel 
     * @param {import("tmi.js").ChatUserstate} tags 
     * @param {string} msg 
     * @param {boolean} self 
     * @param {ExtendedClient} client 
     * @returns 
     */
    run: async (channel, tags, msg, self, client) =>
    {
        // TODO: Improve this.
        console.log([channel, tags['username'], msg].join(' | '));

        if (self || !msg.startsWith('!'))
            return;

        if (tags['message-type'] === 'whisper')
            return client.whisper(tags.username, 'Commands are not functional via whispers. Please try again, in a mutually connected channel.');

        const opts = new CommandOptions(channel, tags, msg, self, client)
        const cmd = client.commands.get(opts.command);
        if (cmd?.name !== opts.command)
            return;
        if (!hasPermission(tags, cmd.permission))
            return;

        cmd.run(opts)
    }
}