import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { addDiscordWebhookURL } from '../utils/sqlite';

export const command = {
    name: 'addreminderhook',
    aliases: [],
    permission: Permissions.OWNER,
    requiresInput: true,
    maxArgs: 2,
    maxArgsErrorMessage: 'Usage: !addreminderhook <channel> <webhookUrl>',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const _error = 'Oops! Something went wrong. Check console for more info.';

        const [_channel, _url] = opts.args;
        const [channel, url] = [_channel.replace('@', ''), _url];

        const dbCall = await addDiscordWebhookURL(channel, url).catch((e) => {
            logger.sysDebug.error(e);
            return;
        });

        if (!dbCall || dbCall.changes === 0) {
            opts.chatClient.say(opts.channel, _error);
            return;
        }
        await opts.chatClient.say(opts.channel, 'Successfully added a DiscordWebhookUrl.');

        // Reloads the webhook cache.
        const hasReloaded = await opts.client
            .loadDiscordWebhooks()
            .then(() => {
                logger.sysDebug.info('Reloaded Discord Webhooks.');
                return true;
            })
            .catch((e) => {
                logger.sysDebug.error(e);
                return false;
            });

        await opts.chatClient.say(opts.channel, !hasReloaded ? _error : 'Reloaded Discord Webhooks.');
        return;
    },
} as Command;
