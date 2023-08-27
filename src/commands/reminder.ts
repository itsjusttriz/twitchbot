import { EmbedBuilder } from 'discord.js';
import { dehashChannel } from '../helper/dehash-channels';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'reminder',
    aliases: [],
    permission: Permissions.MODERATOR,
    requiresInput: true,
    run: async (opts) => {
        const channel = dehashChannel(opts.channel);
        const hook = opts.client.discordWebhooks?.get(channel);
        if (!hook) {
            logger.sysDebug.error(`No webhook found for channel (${channel})`);
            return;
        }

        await hook
            .send({
                username: `Twitch Reminder`,
                embeds: [
                    new EmbedBuilder({
                        title: `@${opts.user}`,
                        description: opts.msgText,
                    }),
                ],
            })
            .then(async (msg) => {
                if (!msg.id) {
                    logger.sysDebug.error(`No msgId for DiscordWebookRequest under Client (${hook.id})`);
                    return;
                }
                logger.sysDebug.success(`Sent Reminder to channel (${msg.channel_id})`);
                await opts.chatClient.say(opts.channel, 'Reminder sent!');
            })
            .catch(async (err) => {
                logger.sysDebug.error(err);
                await opts.chatClient.say(opts.channel, 'Failed to send reminder! Quick, get help! Kappa');
            });
        return;
    },
} as Command;
