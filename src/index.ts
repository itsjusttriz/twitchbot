import express from 'express';
import { client } from './controllers/client.controller';
import { logger } from './utils/Logger';

const app = express();

app.head('/', (req, res) => {
    if (client.settings.debug.enabled) logger.svcBackend.success('Backend called upon!');
    res.status(200).end();
    return;
});

app.get('/download', (req, res, next) => {
    const path = `${process.cwd()}/ijt-twitchbot.db`;
    res.download(path, (err) => {
        if (err) res.status(404).json({ err });
    });
});

app.listen(8082, async () => {
    logger.svcBackend.success('Backend Loaded!');

    const chat = await client.createChatClient();
    chat.connect();

    await client.loadDiscordWebhooks();
    await client.loadEvents();
    await client.loadCommands();

    setTimeout(() => internalUptimeCheck(chat), 1000);
});

function internalUptimeCheck(c: typeof client.chat) {
    c.say(client.settings.debug.logChannel, 'Uptime Check.');
    setTimeout(() => internalUptimeCheck(c), 1000 * 60 * 3);
}
