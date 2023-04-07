import { BasicObjectProps } from '@itsjusttriz/utils';
import { Client } from '@twurple/auth-tmi';
import { createAuthProvider } from './AuthController';

interface IJTClientProps {
    debug?: boolean;
    disableEvents?: boolean;
    disableCommands?: boolean;
}

export class IJTTwitchClient {
    settings: IJTClientProps;
    commands: Map<string, BasicObjectProps>;
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
    debug: true,
    disableEvents: false,
    disableCommands: false,
});