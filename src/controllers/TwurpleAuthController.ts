import fsp from 'fs/promises';
import path from 'path';
import { RefreshingAuthProvider } from '@twurple/auth';

import { config } from './ClientConfigController';
import { logger } from '../utils/Logger';

async function createAuthProvider() {
    const tokenFilePath = path.resolve(__dirname, '../../tokens.json');
    const tokenData = JSON.parse(await fsp.readFile(tokenFilePath, 'utf8'));

    const authProvider = new RefreshingAuthProvider({
        clientId: config?.TWITCH_CLIENT_ID,
        clientSecret: config?.TWITCH_CLIENT_SECRET,
    });

    authProvider.onRefresh(async (userId, newTokenData) => {
        logger.sysDebug.info('Refreshing tokens...');
        await fsp.writeFile(tokenFilePath, JSON.stringify(newTokenData, null, 4), 'utf8');
    });

    authProvider.addUser('127667640', tokenData, ['chat']);
    return authProvider;
}

export { createAuthProvider };
