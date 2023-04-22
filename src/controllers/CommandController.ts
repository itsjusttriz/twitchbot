import fs from 'fs';
import { client } from "./IJTClient";
import { Command } from '../utils/interfaces/Command';
import { LogPrefixes, logger } from '../utils/Logger';

export async function loadCommands() {
    const commands = fs.readdirSync(process.cwd() + '/dist/commands').filter(f => f.endsWith('.js'));
    for (const _command of commands) {
        const { command: cmd } = await import(`../commands/${_command}`) satisfies Command;

        if (!client.settings.disableCommands || !cmd.isDisabled) {
            client.commands.set(cmd.name, cmd);

            if (cmd.aliases?.length) {
                for (const alias of cmd.aliases)
                    client.commands.set(alias, cmd);
            }
        } else
            logger
                .setPrefix(LogPrefixes.CHAT_MESSAGE)
                .info(`Found disabled command: ${cmd.name}`);
    }
}