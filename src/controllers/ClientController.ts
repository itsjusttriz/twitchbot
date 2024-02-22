import { Client } from '@twurple/auth-tmi';
import { WebhookClient } from 'discord.js';
import fs from 'fs';
import path from 'path';

import { config } from './ClientConfigController';

import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { logger } from '../utils/Logger';
import { TwurpleAuthUtils } from '../utils/TwurpleAuthUtils';
import { Command, Event } from '../utils/interfaces';

export class ClientController {
    static config: typeof config = config;
    static commands: Map<string, Command>;
    static discordWebhooks: Map<string, WebhookClient>;
    static api: ApiClient;
    static chat: Client;

    private static _authProvider: Promise<RefreshingAuthProvider>;

    static {
        this.commands = new Map();
        this.discordWebhooks = new Map();
    }

    private constructor() {}

    static createApiClient() {
        this.api = new ApiClient({ authProvider: TwurpleAuthUtils.getAuthProvider() });
        return this.api;
    }

    static createChatClient() {
        this.chat = new Client({
            connection: {
                reconnect: true,
                secure: true,
            },
            authProvider: TwurpleAuthUtils.getAuthProvider(),
            channels: [],
        });
        return this.chat;
    }

    static async experimental_sendShoutout(channelId: string, username: string) {
        try {
            const user = await this.api.users.getUserByName(username.toLowerCase());
            if (!user) {
                throw new Error(`Failed to shoutout user as this user could not be found.`);
            }

            const self = await this.api.users.getUserByName(config.TWITCH_USERNAME);

            await this.api.asUser(self.id, async (ctx) => await ctx.chat.shoutoutUser(channelId, user.id));
        } catch (error) {
            logger.sysDebug.error('experimental_sendShoutout', error.message);
            throw error;
        }
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
}

export const client = ClientController;
