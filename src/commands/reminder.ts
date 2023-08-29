import { EmbedBuilder } from 'discord.js';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'reminder',
    aliases: [],
    permission: Permissions.MODERATOR,
    requiresInput: true,
    run: async (opts) => {
        const channel = _.dehashChannel(opts.channel);
        const hook = opts.client.discordWebhooks?.get(channel);
        if (!hook) {
            logger.sysDebug.error(`No webhook found for channel (${channel})`);
            return;
        }

        const embed = new EmbedBuilder().setTitle(`@${opts.user}`).setDescription(`${opts.msgText} `);

        let shouldSendResponse: boolean;
        try {
            await hook.send({
                username: `Twitch Reminder`,
                embeds: [embed],
            });
            shouldSendResponse = true;
            logger.sysDebug.success(`Sent Reminder to DiscordWebhook with the following ID: (${hook.id})`);
        } catch (error) {
            logger.sysDebug.error(error);
            shouldSendResponse = true;
        }

        let resp = shouldSendResponse ? 'Reminder Sent!' : 'Something went wrong? An error was recorded.';
        await opts.chatClient.say(opts.channel, resp);
        return;
    },
} as Command;
