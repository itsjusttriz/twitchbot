import fs from 'fs';
import { client } from './utils/auth-provider.js';


(async () => {
    const twitchChat = await client.getChatClient();
    twitchChat.connect().catch(console.warn);

    const events = fs.readdirSync(process.cwd() + '/dist/events').filter(f => f.endsWith('.js'));
    for (const event of events) {
        const { default: e } = await import(`./events/${event}`);
        if (e.once)
            twitchChat.once(e.name, (...args) => e.run(...args, client));
        else
            twitchChat.on(e.name, (...args) => e.run(...args, client));
    }


    const commands = fs.readdirSync(process.cwd() + '/dist/commands').filter(f => f.endsWith('.js'));
    for (const command of commands) {
        const { default: cmd } = await import(`./commands/${command}`);
        if (cmd && cmd.name)
            client.commands.set(cmd.name, cmd);
    }
})();