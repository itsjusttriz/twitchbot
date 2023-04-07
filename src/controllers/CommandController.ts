import fs from 'fs';
import { client } from "./IJTClient";
import { Command } from '../utils/interfaces/Command';

export async function loadCommands() {
    const commands = fs.readdirSync(process.cwd() + '/dist/commands').filter(f => f.endsWith('.js'));
    for (const _command of commands) {
        const { command: cmd } = await import(`../commands/${_command}`);
        if (!(cmd satisfies Command)) return;

        if (!client.settings.disableCommands || cmd.isDisabled)
            client.commands.set(cmd.name, cmd);
        else
            console.log(`Found disabled command: ${cmd.name}`);
    }
}