import { RefreshingAuthProvider } from '@twurple/auth';
import { promises as fsp } from 'fs';
import path from 'path';
import { config } from '../controllers/ClientConfigController';
import { logger } from './Logger';

export namespace TwurpleAuthUtils {
    const TOKEN_FILE_PATH = path.resolve(__dirname, '../../tokens.json');

    const auth = new RefreshingAuthProvider({
        clientId: config.TWITCH_CLIENT_ID,
        clientSecret: config.TWITCH_CLIENT_SECRET,
    });

    auth.onRefresh(async (userId, newTokenData) => {
        logger.sysDebug.info('Refreshing tokens...');
        await fsp.writeFile(TOKEN_FILE_PATH, JSON.stringify(newTokenData, null, 4), 'utf8');
    });

    export const assignSelfToAuthProvider = async () => {
        const _parsed = JSON.parse(await fsp.readFile(TOKEN_FILE_PATH, 'utf8'));
        auth.addUser(config.TWITCH_USER_ID, _parsed, ['chat']);
    };

    export const getAuthProvider = () => {
        return auth;
    };
}
