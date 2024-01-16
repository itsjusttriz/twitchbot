import { Client } from '@twurple/auth-tmi';
import { WebhookClient } from 'discord.js';
import fs from 'fs';
import path from 'path';

import { config } from './ClientConfigController';
import { createAuthProvider } from './TwurpleAuthController';
import { discordHooksDb } from './DatabaseController/DiscordWebhookDatabaseController';

import { _ } from '../utils/index';
import { Command, Event } from '../utils/interfaces';
import { logger } from '../utils/Logger';

export class ClientController {
    static config: typeof config = config;
    static commands: Map<string, Command>;
    static discordWebhooks: Map<string, WebhookClient>;
    private static _chat: Client;
    static {
        this.commands = new Map();
        this.discordWebhooks = new Map();
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
        const filePath = path.resolve(__dirname, '../events');
        const events = fs.readdirSync(filePath).filter((f) => f.endsWith('.js'));

        for (const event of events) {
            const { event: e } = (await import(`file://${filePath}/${event}`)) as { event: Event };

            if (e.isDisabled) {
                logger.sysEvent.error(`Found disabled event: ${e.name}`);
                continue;
            }

            if (e.once) client.chat.once(e.name, (...args: any) => e.run(client, ...args));
            else client.chat.on(e.name, (...args: any) => e.run(client, ...args));
        }
    }

    static async loadCommands() {
        const filePath = path.resolve(__dirname, '../commands');
        const commands = fs.readdirSync(filePath).filter((f) => f.endsWith('.js'));

        for (const cmdName of commands) {
            const { command: cmd } = (await import(`file://${filePath}/${cmdName}`)) as { command: Command };

            if (cmd.isDisabled) {
                logger.sysChat.error(`Found disabled command: ${cmd.name}`);
                continue;
            }

            client.commands.set(cmd.name, cmd);

            if (cmd.aliases?.length) for (const alias of cmd.aliases) client.commands.set(alias, cmd);
        }
    }

    static async loadDiscordWebhooks() {
        try {
            this.discordWebhooks.clear();

            const channels = await discordHooksDb.getAllWebhooks().catch(_.quickCatch);
            if (!channels) {
                throw 'Failed to get discord webhooks from database.';
            }

            for (const { channel, url } of Object.values(channels)) {
                const hook = new WebhookClient({ url });
                hook.rest.on('rateLimited', async (info) => {
                    const timeLeft = info.timeToReset / 1000;
                    await this.chat.say(
                        this.config.DEBUG_CHANNEL,
                        `@${this.config.DEBUG_CHANNEL} -> DiscordWebhook for channel (${channel}) has been rate-limited. Time left: ${timeLeft}`
                    );
                });
                this.discordWebhooks.set(channel, hook);
            }
            return true;
        } catch (error) {
            logger.sysDebug.error(error);
            return false;
        }
    }
}

export const client = ClientController;
