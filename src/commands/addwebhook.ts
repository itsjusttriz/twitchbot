import { discordHooksDb } from '../controllers/DatabaseController/DiscordWebhookDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'addwebhook',
    aliases: [],
    permission: 'OWNER',
    requiresInput: true,
    minArgs: 2,
    min_args_error_message: 'Usage: !addwebhook <channel> <webhookUrl>',
    maxArgs: 2,
    maxArgsErrorMessage: 'Usage: !addwebhook <channel> <webhookUrl>',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        try {
            const [channel, url] = opts.args;

            const query = await discordHooksDb.addWebhook(_.unmentionUser(channel), url).catch(_.quickCatch);
            if (!query || !query.changes) {
                throw `Failed to add webhook to the database.`;
            }

            await opts.chatClient.say(opts.channel, 'Webhook Saved.');

            const hasReloaded = await opts.client.loadDiscordWebhooks();
            if (!hasReloaded) {
                throw 'Failed to reload webhooks.';
            }

            await opts.chatClient.say(opts.channel, 'Webhooks reloaded.');
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(opts.channel, error);
        }
        return;
    },
} as Command;
