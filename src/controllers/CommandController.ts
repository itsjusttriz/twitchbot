import fs from 'fs';
import { client } from "./IJTClient";
import { Command } from '../utils/interfaces/Command';
import { logger } from '../utils/logger';

export async function loadCommands() {
    const commands = fs.readdirSync(process.cwd() + '/dist/commands').filter(f => f.endsWith('.js'));
    for (const _command of commands) {
        const { command: cmd } = await import(`../commands/${_command}`) satisfies Command;

        if (!client.settings.disableCommands || !cmd.isDisabled) {
            client.commands.set(cmd.name, cmd);

            if (cmd.aliases?.length) {
                console.log(cmd.aliases)
                for (const alias of cmd.aliases)
                    client.commands.set(alias, cmd);
            }
        } else
            logger.info(`[System] Found disabled command: ${cmd.name}`);
    }
}