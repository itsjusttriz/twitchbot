import { EmbedBuilder } from 'discord.js';
import { ChatUserstate } from 'tmi.js';
import { ITime } from '@itsjusttriz/utils';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

const storedRedemptions = new Map([['59f7fed7-2fb0-44a0-9cf6-6a17740ffd57', 'Punday Monday!'], ['292c720e-64d0-4839-ae02-dd0416c3ad0b','Take Photo']]);

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

        const rewardName = storedRedemptions.has(rewardType) ? storedRedemptions.get(rewardType) : rewardType;

        const embed = new EmbedBuilder().setTitle(`Twitch Channel Point Redemption Event - ${channel}`).setDescription(
            [
                // Assign similar formatting.
                ...Object.entries({
                    User: username,
                    'Reward Type': rewardName,
                }).map(([key, value]) => `**${key}:** \` ${value} \``),

                // This one is seperate due to the formatting being different.
                `**Message:** \`\`\`\n${message}\n\`\`\``,
            ].join('\n')
        );

        try {
            const hook = client.discordWebhooks.get('ijtdev');
            if (!hook) throw 'DiscordWebhook not found?!';

            await hook.send({ username: `TwitchBot Log`, embeds: [embed] });
        } catch (error) {
            logger.sysDebug.error('EVENT/REDEEM -> DiscordWebhook failed to send message: ' + error);
        }

        switch (rewardName) {
            case 'Punday Monday!': {
                const MIN_WAIT_TIME = 0;
                const MAX_WAIT_TIME = 5;
                const random = Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME + 1) + MIN_WAIT_TIME;
                await ITime.wait(random / 1000);
                await client.chat.say(channel, 'NotLikeThis');
                break;
            }
        }

        return;
    },
} as Event;
