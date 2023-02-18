import fs from 'fs';
import { client } from './utils/auth-provider.js';


async function main() {
    const twitchChat = await client.getChatClient();
    twitchChat.connect().catch(console.warn);

    const eFiles = fs.readdirSync('./src/events').filter(f => f.endsWith('.js'));
    for (const file of eFiles) {
        const { default: e } = await import(`./events/${file}`);
        if (e.once)
            twitchChat.once(e.name, (...args) => e.run(...args, client));
        else
            twitchChat.on(e.name, (...args) => e.run(...args, client));
    }


    const cmdFiles = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'));
    for (const file of cmdFiles) {
        const { default: cmd } = await import(`./commands/${file}`);
        if (cmd && cmd.name)
            client.commands.set(cmd.name, cmd);
    }
}
main();