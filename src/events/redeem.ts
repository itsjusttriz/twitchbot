import { EmbedBuilder } from 'discord.js';
import { ChatUserstate } from 'tmi.js';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

export const event = {
    name: 'redeem',
    once: false,
    run: async (
        client,
        channel: string,
        username: string,
        rewardType: 'highlighted-message' | 'skip-subs-mode-message' | string,
        tags: ChatUserstate,
        message: string
    ) => {
        logger.sysEvent.info('EVENT/REDEEM -> ' + JSON.stringify({ channel, username, rewardType }, null, 4));

        const chan = _.dehashChannel(channel);

        const hook = client.discordWebhooks.get('ijtdev');
        if (!hook) return;

        const embed = new EmbedBuilder().setTitle(`Twitch Channel Point Redemption Event - ${channel}`).setDescription(
            [
                // Assign similar formatting.
                ...Object.entries({
                    User: username,
                    'Reward Type': rewardType,
                }).map(([key, value]) => `**${key}:** \` ${value} \``),

                // This one is seperate due to the formatting being different.
                `**Message:** \`\`\`\n${message}\n\`\`\``,
            ].join('\n')
        );

        try {
            await hook.send({ username: `TwitchBot Log`, embeds: [embed] });
        } catch (error) {
            logger.sysDebug.error('EVENT/REDEEM -> DiscordWebhook failed to send message.');
        }

        return;
    },
} as Event;
