import { RefreshingAuthProvider } from '@twurple/auth';
import fsp from 'fs/promises';
import path from 'path';

import config from '../../config.json';

async function createAuthProvider() {
    const tokenFilePath = path.resolve(__dirname, '../../tokens.json');
    const tokenData = JSON.parse(await fsp.readFile(tokenFilePath, 'utf8'));

    const authProvider = new RefreshingAuthProvider({
        clientId: config?.twitch.CLIENT_ID,
        clientSecret: config?.twitch.CLIENT_SECRET,
        onRefresh: async (userId, newTokenData) =>
            await fsp.writeFile(tokenFilePath, JSON.stringify(newTokenData, null, 4), 'utf8'),
    });

    authProvider.addUser('127667640', tokenData, ['chat']);
    return authProvider;
}

export { createAuthProvider };
