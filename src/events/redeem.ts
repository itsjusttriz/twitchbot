import { EmbedBuilder } from 'discord.js';
import { ChatUserstate } from 'tmi.js';
import { cpRedemptionsDb } from '../controllers/DatabaseController/ChannelPointsRedemptionsDatabaseController';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';
import { _ } from '../utils';

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
        try {
            const storedReward = await cpRedemptionsDb.getRedemption(rewardType);
            if (!storedReward) {
                await cpRedemptionsDb.createRedemption(_.dehashChannel(channel), rewardType);
                throw 'Failed to get redemption from database. Attempted to create one, instead.';
            }

            if (!!storedReward.outcome) {
                for (const line of storedReward.outcome.split('\\n')) {
                    if (!!storedReward.disabled) break;
                    if (client.config.IS_MUTED) break;
                    await client.chat.say(storedReward.channel, line).catch((e) => {
                        logger.sysEvent.error(`Failed to send message in channel (${storedReward.channel}): "${line}"`);
                    });
                }
            }

            if (!storedReward.loggable) return;

            const hook = client.discordWebhooks.get('ijtdev');
            if (!hook) {
                throw 'Failed to get DiscordWebhookURL to send the redemption log to.';
            }

            const embed = new EmbedBuilder()
                .setTitle(`Twitch Channel Point Redemption Event - ${channel}`)
                .setDescription(
                    [
                        // Assign similar formatting.
                        ...Object.entries({
                            User: username,
                            'Reward Type': !storedReward.title ? storedReward.id : storedReward.title,
                        }).map(([key, value]) => `**${key}:** \` ${value} \``),

                        // This one is seperate due to the formatting being different.
                        `**Message:** \`\`\`\n${message}\n\`\`\``,
                    ].join('\n')
                );

            await hook.send({ username: 'TwitchBot Log', embeds: [embed] });
        } catch (error) {
            logger.sysEvent.error(error);
        }
    },
} as Event;
