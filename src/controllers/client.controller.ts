import { Client } from '@twurple/auth-tmi';
import { BasicObjectProps } from '@itsjusttriz/utils';
import fs from 'fs';

import { createAuthProvider } from './auth.controller';
import { Event, Command } from '../utils/interfaces';

import config from '../config.json';
import { WebhookClient } from 'discord.js';
import { getValidDiscordWebhookURLs } from '../utils/sqlite';
import { logger } from '../utils/Logger';

export class ClientController {
    static settings: BasicObjectProps;
    static commands: Map<string, Command>;
    static discordWebhooks: Map<string, WebhookClient>;
    private static _chat: Client;
    static {
        this.commands = new Map();
        this.discordWebhooks = new Map();

        if (config) this.settings = { ...config.settings };
        else this.settings = null;
    }

    private constructor() {}

    static get chat(): Client {
        return this._chat;
    }

    static async createChatClient() {
        this._chat = new Client({
            connection: {
                reconnect: true,
                secure: true,
            },
            authProvider: await createAuthProvider(),
            channels: [],
        });
        return this._chat;
    }

    static async loadEvents() {
        const events = fs.readdirSync(process.cwd() + '/dist/events').filter((f) => f.endsWith('.js'));

        for (const event of events) {
            const { event: e } = (await import(`../events/${event}`)) as { event: Event };

            if (e.isDisabled || client.settings.eventsDisabled) {
                logger.sysEvent.error(`Found disabled event: ${e.name}`);
                continue;
            }

            if (e.once) client.chat.once(e.name, (...args: any) => e.run(client, ...args));
            else client.chat.on(e.name, (...args: any) => e.run(client, ...args));
        }
    }

    static async loadCommands() {
        const commands = fs.readdirSync(process.cwd() + '/dist/commands').filter((f) => f.endsWith('.js'));

        for (const cmdName of commands) {
            const { command: cmd } = (await import(`../commands/${cmdName}`)) as { command: Command };

            if (cmd.isDisabled || client.settings.commandsDisabled) {
                logger.sysChat.error(`Found disabled command: ${cmd.name}`);
                continue;
            }

            client.commands.set(cmd.name, cmd);

            if (cmd.aliases?.length) for (const alias of cmd.aliases) client.commands.set(alias, cmd);
        }
    }

    static async loadDiscordWebhooks() {
        this.discordWebhooks.clear();

        const channels = await getValidDiscordWebhookURLs();
        if (!channels) {
            throw new Error('Could not run getValidDiscordWebhookURLs()');
        }

        for (const { channel, url } of Object.values(channels)) {
            const hook = new WebhookClient({ url });
            hook.rest.on('rateLimited', async (info) => {
                const timeLeft = info.timeToReset / 1000;
                await this.chat.say(
                    this.settings.debug.logChannel,
                    `@itsjusttriz -> DiscordWebhook for channel (${channel}) has been rate-limited. Time left: ${timeLeft}`
                );
            });
            this.discordWebhooks.set(channel, hook);
        }
        return;
    }
}

export const client = ClientController;
