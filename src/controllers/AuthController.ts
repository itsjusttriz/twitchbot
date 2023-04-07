import { RefreshingAuthProvider } from "@twurple/auth";
import fsp from 'fs/promises';

import config from '../config.json';

async function createAuthProvider() {
    const tokenData = JSON.parse(await fsp.readFile('./tokens.json', 'utf8'));

    const authProvider = new RefreshingAuthProvider({
        clientId: config?.CLIENT_ID,
        clientSecret: config?.CLIENT_SECRET,
        onRefresh: async (userId, newTokenData) => await fsp.writeFile(`./tokens.json`, JSON.stringify(newTokenData, null, 4), 'utf8')
    });

    authProvider.addUser('127667640', tokenData, ['chat']);
    return authProvider;
}

export { createAuthProvider };