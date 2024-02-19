import { EmbedBuilder } from 'discord.js';
import { RaidUserstate } from 'tmi.js';
import { raidEventDb } from '../controllers/DatabaseController/ChannelRaidDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

export const event = {
    name: 'raided',
    once: false,
    run: async (client, channel: string, username: string, viewers: number, tags: RaidUserstate) => {
        try {
            const storedRaid = await raidEventDb.getRaidOutcome(_.dehashChannel(channel)).catch(_.quickCatch);
            if (!storedRaid) {
                await raidEventDb.createRaidOutcome(_.dehashChannel(channel));
                throw 'Failed to get raid outcome from database. Attempted to create one, instead.';
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

            if (!!storedRaid.shoutout && !storedRaid.disabled) {
                await client.experimental_sendShoutout(tags['room-id'], username).catch(() => {
                    throw `Shoutout: Failed to perform /shoutout on raider. (Raider was possibly shouted-out already?!)`;
                });
            }

            if (!storedRaid.loggable) return;

            const hook = client.discordWebhooks.get('ijtdev');
            if (!hook) {
                throw 'Failed to get DiscordWebhookURL to send the raid event log to.';
            }

            const embed = new EmbedBuilder()
                .setTitle(`Twitch Raid Event - ${channel}`)
                .setDescription(
                    [
                        `This event response **${
                            !storedRaid.disabled && viewers >= storedRaid.condition ? 'WAS' : 'WAS NOT'
                        }** triggered.\n`,
                        ...Object.entries({
                            Raider: username,
                            isDisabled: `${!!storedRaid.disabled}`.toUpperCase(),
                            Viewers: viewers,
                            'Min. Viewers': storedRaid.condition,
                        }).map(([key, value]) => {
                            return `**${key}:** \` ${value} \``;
                        }),

                        // This one is seperate due to the formatting being different.
                        `**Response(s):** \`\`\`\n${storedRaid.outcome.split('\\n').join('\n')}\n\`\`\``,
                    ].join('\n')
                )
                // If the response SHOULD be sent & current viewers is above, or equal to, the min. viewers... be GREEN... otherwise, be RED.
                .setColor(!storedRaid.disabled && viewers >= storedRaid.condition ? 'Green' : 'Red');

            await hook.send({ username: 'TwitchBot Log', embeds: [embed] });
        } catch (error) {
            logger.sysEvent.error(error);
            if (error.startsWith('Shoutout:')) {
                client.chat.say(channel, error);
            }
        }
    },
} as Event;
