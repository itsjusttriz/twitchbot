import path from 'path';
import express from 'express';
import { client } from './controllers/ClientController';
import { logger } from './utils/Logger';

const app = express();

app.get('/download', (req, res, next) => {
    const filepath = path.resolve(__dirname, './ijt-twitchbot.db');
    res.download(filepath, (err) => {
        if (err) res.status(404).json({ err });
    });
});

app.listen(8082, async () => {
    logger.svcBackend.success('Backend Loaded!');

    const chat = await client.createChatClient();
    chat.connect();

    await client.createApiClient();

    await client.loadDiscordWebhooks();
    await client.loadEvents();
    await client.loadCommands();
});
