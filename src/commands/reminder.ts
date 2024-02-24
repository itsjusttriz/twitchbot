import { EmbedBuilder } from 'discord.js';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'reminder',
    aliases: [],
    permission: 'MODERATOR',
    requiresInput: true,
    run: async (opts) => {
        try {
            const channel = _.dehashChannel(opts.channel);
            const hook = opts.client.discordWebhooks?.get(channel);
            if (!hook) {
                throw `No webhook found for channel (${channel})`;
            }

            const embed = new EmbedBuilder().setTitle(`@${opts.user}`).setDescription(`${opts.msgText} `);

            const sent = await hook.send({ username: `Twitch Reminder`, embeds: [embed] }).catch(_.quickCatch);
            if (!sent) {
                throw 'Failed to send reminder.';
            }

            await opts.chatClient.say(opts.channel, 'Reminder sent.');
            logger.sysDebug.success(`Sent Reminder to DiscordWebhook with the following ID: (${hook.id})`);
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(opts.channel, error);
        }
    },
} as Command;
