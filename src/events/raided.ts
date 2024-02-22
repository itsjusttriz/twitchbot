import { EmbedBuilder } from 'discord.js';
import { RaidUserstate } from 'tmi.js';
import { raidEventDb } from '../controllers/DatabaseController/ChannelRaidDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';
import { DiscordWebhookManager } from '../managers/DiscordWebhookManager';

export const event = {
    name: 'raided',
    once: false,
    run: async (client, channel: string, username: string, viewers: number, tags: RaidUserstate) => {
        try {
            const storedRaid = await raidEventDb.getRaidOutcome(_.dehashChannel(channel)).catch(_.quickCatch);
            if (!storedRaid) {
                await raidEventDb.createRaidOutcome(_.dehashChannel(channel));
                throw new Error('Failed to get raid outcome from database. Attempted to create one, instead.');
            }

            if (!!storedRaid.outcome) {
                const lines = await _.parseCustomVarsInMessage(storedRaid.outcome, {
                    channel,
                    username,
                    viewers,
                });

                for (const line of lines.split('\\n')) {
                    if (!!storedRaid.disabled) break;
                    if (client.config.IS_MUTED) break;
                    if (viewers < storedRaid.condition) break;
                    await client.chat.say(storedRaid.channel, line).catch((e) => {
                        logger.sysEvent.error(`Failed to send message in channel (${storedRaid.channel}): "${line}"`);
                    });
                }
            }

            if (!!storedRaid.shoutout && !storedRaid.disabled && viewers >= storedRaid.condition) {
                await client.experimental_sendShoutout(tags['room-id'], username).catch(() => {
                    throw new Error(
                        `Shoutout: Failed to perform /shoutout on raider. (Raider was possibly shouted-out already?!)`
                    );
                });
            }

            if (!storedRaid.loggable) return;

            await DiscordWebhookManager.sendEmbedToServer('ijtdev', {
                username: DiscordWebhookManager.TWITCHBOT_LOG_TAG,
                embed: {
                    title: `Twitch Raid Event - ${channel}`,
                    description: [
                        `This event response **${
                            !storedRaid.disabled && viewers >= storedRaid.condition ? 'WAS' : 'WAS NOT'
                        }** triggered\n`,
                        `**raider:** \` ${username} \``,
                        `**isDisabled:** \` ${(!!storedRaid.disabled).toString().toUpperCase()} \``,
                        `**viewers:** \` ${viewers} \``,
                        `**min_viewers:** \` ${storedRaid.condition} \``,
                        `**response(s):** \`\`\`\n${storedRaid.outcome.split('\\n').join('\n')}\n\`\`\``,
                    ].join('\n'),
                    color:
                        !storedRaid.disabled && viewers >= storedRaid.condition
                            ? parseInt('00a606', 16)
                            : parseInt('a6001c', 16),
                },
            });
        } catch (error) {
            logger.sysEvent.error(error);
            if (error.message.startsWith('Shoutout:')) {
                client.chat.say(channel, error.message);
            }
        }
    },
} as Event;
