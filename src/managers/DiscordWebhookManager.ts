import { EmbedBuilder, EmbedData, WebhookClient } from 'discord.js';
import { discordHooksDb } from '../controllers/DatabaseController/DiscordWebhookDatabaseController';
import { logger } from '../utils/Logger';

type SendWebhookMessageOptions = {
    username: string;
    embed: EmbedData;
};

export namespace DiscordWebhookManager {
    const _webhooks = new Map<string, WebhookClient>();

    export const TWITCHBOT_LOG_TAG = 'TwitchBot Log';
    export const TWITCH_REMINDER_TAG = 'Twitch Reminder';

    export const registerWebhooks = async () => {
        try {
            if (_webhooks.size) {
                _webhooks.clear();
            }

            const storedHooks = await discordHooksDb.getAllWebhooks().catch((e) => {
                throw new Error(`Failed to fetch stored DiscordWebhooks -> ${e.message}`);
            });

            for (const { channel, url } of Object.values(storedHooks)) {
                const _hook = new WebhookClient({ url });
                _hook.rest.on('rateLimited', async (info) => {
                    const timeLeft = info.timeToReset / 1000;
                    logger.sysDebug.error(`DiscordWebhook (${channel}) has been rate-limited. Time left: ${timeLeft}`);
                });
                _webhooks.set(channel, _hook);
            }
        } catch (error) {
            logger.sysDebug.error(error.message);
        }
    };

    export const sendEmbedToServer = async (id: string, opts: SendWebhookMessageOptions) => {
        try {
            const hook = _webhooks.get(id);
            if (!hook) {
                throw new Error(`DiscordWebhook instance for ${id} was not found.`);
            }

            const embed = new EmbedBuilder(opts.embed);

            await hook.send({ username: opts.username, embeds: [embed] }).catch((e) => {
                throw new Error(`Failed to send a WebhookMessage -> ${e.message}`);
            });
        } catch (error) {
            throw error;
        }
    };
}
