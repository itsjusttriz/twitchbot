import { _ } from '../utils';
import { DiscordWebhookManager } from '../managers/DiscordWebhookManager';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'reminder',
    aliases: [],
    permission: 'MODERATOR',
    requiresInput: true,
    run: async (opts) => {
        const channel = _.dehashChannel(opts.channel);

        try {
            await DiscordWebhookManager.sendEmbedToServer(channel, {
                username: DiscordWebhookManager.TWITCH_REMINDER_TAG,
                embed: {
                    title: `@${opts.user}`,
                    description: `${opts.msgText} `,
                },
            });

            await opts.chatClient.say(channel, 'Reminder sent.');
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(channel, error.message);
        }
    },
} as Command;
