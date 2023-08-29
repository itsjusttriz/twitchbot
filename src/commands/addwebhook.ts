import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { addDiscordWebhookURL } from '../utils/sqlite';

export const command = {
    name: 'addwebhook',
    aliases: [],
    permission: Permissions.OWNER,
    requiresInput: true,
    minArgs: 2,
    min_args_error_message: 'Usage: !addwebhook <channel> <webhookUrl>',
    maxArgs: 2,
    maxArgsErrorMessage: 'Usage: !addwebhook <channel> <webhookUrl>',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const _error = 'Something went wrong? An error was recorded.';

        const [channel, url] = opts.args;

        const dbCall = await addDiscordWebhookURL(_.unmentionUser(channel), url).catch((e) => {
            logger.sysDebug.error(e);
            return { changes: 0 };
        });

        if (!dbCall.changes) {
            opts.chatClient.say(opts.channel, _error);
            return;
        }
        await opts.chatClient.say(opts.channel, 'Successfully added a DiscordWebhookUrl.');

        // Reloads the webhook cache.
        let hasReloaded: boolean;
        try {
            await opts.client.loadDiscordWebhooks();
            logger.sysDebug.info('Reloaded Discord Webhooks.');
            hasReloaded = true;
        } catch (error) {
            logger.sysDebug.error(error);
            hasReloaded = false;
        }

        await opts.chatClient.say(opts.channel, !hasReloaded ? _error : 'Reloaded Discord Webhooks.');
        return;
    },
} as Command;
