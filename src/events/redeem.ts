import { ChatUserstate } from 'tmi.js';
import { cpRedemptionsDb } from '../controllers/DatabaseController/ChannelPointsRedemptionsDatabaseController';
import { _ } from '../utils';
import { DiscordWebhookUtils } from '../utils/DiscordWebhookUtils';
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

            await DiscordWebhookUtils.sendEmbedToServer('ijtdev', {
                username: DiscordWebhookUtils.TWITCHBOT_LOG_TAG,
                embed: {
                    title: `Twitch Channel Point Redemption Event - ${channel}`,
                    description: [
                        `**user:** \` ${username} \``,
                        `**reward_type:** \` ${!storedReward.title ? storedReward.id : storedReward.title} \``,
                        `**message:** \`\`\`\n${message}\n\`\`\``,
                    ].join('\n'),
                },
            });
        } catch (error) {
            logger.sysEvent.error(error);
        }
    },
} as Event;
