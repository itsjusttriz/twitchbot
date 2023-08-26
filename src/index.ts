import { client } from './controllers/client.controller';
import { logger } from './utils/Logger';
import express from 'express';

const app = express();

app.head('/', (req, res) => {
    if (client.settings.debug.enabled) logger.svcBackend.success('Backend called upon!');
    res.status(200).end();
    return;
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
    c.say('ijtdev', 'Uptime Check.');
    setTimeout(() => internalUptimeCheck(c), 1000 * 60 * 3);
}
