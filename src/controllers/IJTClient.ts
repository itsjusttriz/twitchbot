import { Client } from '@twurple/auth-tmi';
import { createAuthProvider } from './AuthController';
import { Command } from '../utils/interfaces/Command';

interface IJTClientProps {
    debug?: boolean;
    disableEvents?: boolean;
    disableCommands?: boolean;
}

export class IJTTwitchClient {
    settings: IJTClientProps;
    commands: Map<string, Command>;
    private _chat: Client;

    constructor(opts: IJTClientProps) {
        this.commands = new Map();
        this.settings = opts;
    }

    get chat() {
        return this._chat;
    }

    async createChatClient() {
        this._chat = new Client({
            connection: {
                reconnect: true,
                secure: true
            },
            authProvider: await createAuthProvider(),
            channels: []
        });
        return this._chat;
    }
}

export const client = new IJTTwitchClient({
    debug: false,
    disableEvents: false,
    disableCommands: false,
});