import { RefreshingAuthProvider } from '@twurple/auth';
import { Client } from '@twurple/auth-tmi';
import { promises as fsp } from 'fs';
import { twitchConfig } from './twitch-config.js';


const tokenData = JSON.parse(await fsp.readFile('./tokens.json', 'UTF-8'));

const auth = {

    _authProvider: new RefreshingAuthProvider(
        {
            clientId: twitchConfig?.CLIENT_ID || process.env?.CLIENT_ID,
            clientSecret: twitchConfig?.CLIENT_SECRET || process.env?.CLIENT_SECRET,
            onRefresh: async newTokenData => await fsp.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        },
        tokenData
    ),

    get provider()
    {
        return this._authProvider;
    }
}

export const client = new Client({
    connection: {
        reconnect: true,
        secure: true
    },
    authProvider: auth.provider,
    channels: []
});