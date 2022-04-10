import { hasPermission } from "../utils/check-command-permissions.js";
import { CommandOptions } from "../utils/command-options.js";
import fs from 'fs';

export default {
    name: 'message',
    once: false,
    run: async (channel, tags, msg, self, client) =>
    {
        // TODO: Improve this.
        console.log([channel, tags['username'], msg].join(' | '));

        if (self || !msg.startsWith('!'))
            return;

        if (tags['message-type'] === 'whisper')
            return client.whisper(tags.username, 'Commands are not functional via whispers. Please try again, in a mutually connected channel.');

        const opts = new CommandOptions(channel, tags, msg, self, client)

        const cmdFiles = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'));
        for (const file of cmdFiles)
        {
            const { default: cmd } = await import(`../commands/${file}`);

            if (cmd?.name !== opts.command)
                return;
            if (!hasPermission(tags, cmd.permission))
                return;

            cmd.run(opts).catch(console.error);
        }
    }
}