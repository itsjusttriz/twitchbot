import { RefreshingAuthProvider } from '@twurple/auth';
import { BasicObjectProps } from '@itsjusttriz/utils';
import { promises as fsp } from 'fs';
import config from '../config.json';
import { Client } from '@twurple/auth-tmi';

export class IJTTwitchClient {
    commands: Map<string, BasicObjectProps>;
    private _cachedAuthProvider: Promise<RefreshingAuthProvider>;
    private _cachedChatClient: Promise<Client>;

    constructor() {
        this.commands = new Map();
    }

    private async _createAuthProvider() {
        const tokenData = JSON.parse(await fsp.readFile('./tokens.127667640.json', 'utf8'));
        const authProvider = new RefreshingAuthProvider({
            clientId: config?.CLIENT_ID || process.env?.CLIENT_ID,
            clientSecret: config?.CLIENT_SECRET || process.env?.CLIENT_SECRET,
            onRefresh: async (userId, newTokenData) => await fsp.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'utf8')
        });

        authProvider.addUser('127667640', tokenData, ['chat']);
        return authProvider;
    }

    async getAuthProvider() {
        return this._cachedAuthProvider ?? (this._cachedAuthProvider = this._createAuthProvider());
    }

    private async _createChatClient() {
        return new Client({
            connection: {
                reconnect: true,
                secure: true
            },
            authProvider: await this.getAuthProvider(),
            channels: []
        });
    }

    async getChatClient() {
        return this._cachedChatClient ?? (this._cachedChatClient = this._createChatClient());
    }
}

export const client = new IJTTwitchClient();