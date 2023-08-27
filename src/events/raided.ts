import { RaidUserstate } from 'tmi.js';
import { dehashChannel } from '../helper/dehash-channels';
import { Event } from '../utils/interfaces/Event';
import { addChannelEvent, getChannelEvent } from '../utils/sqlite';
import { logger } from '../utils/Logger';
import { EmbedBuilder } from 'discord.js';

const _catch = (e: any) => {
    logger.sysDebug.error(e);
    return;
};

const parseVars = async (channel: string, username: string, viewers: number, message: string) => {
    return message
        .replaceAll('{channel}', channel)
        .replaceAll('{username}', username)
        .replaceAll('{viewercount}', viewers.toString());
};

const noEventFallback = async (hook: any, channel: string) => {
    if (hook) {
        const m = await hook
            .send({
                username: `Twitch Raid Event - ${channel}`,
                content: `No event:raided config found for channel (${channel})`,
            })
            .catch(_catch);

        if (!m || !m.id) {
            logger.sysDebug.error('DiscordWebhook failed to send message.');
        }
    }

    await addChannelEvent(channel, 'raided')
        .then(() => {
            logger.db.success(`Added DiscordWebhook for channel (${channel})`);
        })
        .catch((e) => {
            logger.db.error(e);
            return;
        });
};

export const event = {
    name: 'raided',
    once: false,
    run: async (client, channel: string, username: string, viewers: number, tags: RaidUserstate) => {
        const chan = dehashChannel(channel);
        const event = await getChannelEvent(chan, 'raided').catch((e) => {
            logger.db.error(e);
            return;
        });

        let shouldRespondToEvent = true;

        const hook = client.discordWebhooks.get('ijtdev');
        if (!hook) {
            logger.db.error('{event:raided} No DiscordWebhook found!');
        }

        if (!event) {
            await noEventFallback(hook, chan);
            shouldRespondToEvent = false;
        }

        const isDisabled = Boolean(event.disabled);
        if (isDisabled) shouldRespondToEvent = false;

        if (viewers < parseInt(event.trigger)) shouldRespondToEvent = false;

        const response = (await parseVars(chan, username, viewers, event.message)).split('\\n');

        for (const line of response) {
            if (!shouldRespondToEvent) break;
            if (client.settings.isMuted) break;
            await client.chat.say(chan, line).catch((e) => {
                logger.sysDebug.error(`Failed to send message in channel (${chan}): "${line}"`);
            });
        }

        if (!hook) return;

        const logObj = {
            channel,
            raider: username,
            isDisabled,
            viewers,
            trigger: parseInt(event.trigger),
            response,
        };
        const m = await hook
            .send({
                username: `TwitchBot Log`,
                embeds: [
                    new EmbedBuilder({
                        title: `Raid Event - ${logObj.channel}`,
                        description: [
                            `This event response **${shouldRespondToEvent ? 'WAS' : 'WAS NOT'}** triggered.\n`,
                            ...Object.entries({
                                Raider: logObj.raider,
                                isDisabled: `${isDisabled}`.toUpperCase(),
                                Viewers: logObj.viewers,
                                'Min. Viewers': logObj.trigger,
                            }).map(([key, value]) => {
                                return `**${key}:** \` ${value} \``;
                            }),

                            // This one is seperate due to the formatting being different.
                            `**Response(s):** \`\`\`\n${response.join('\n')}\n\`\`\``,
                        ].join('\n'),

                        // If the response SHOULD be sent & current viewers is above, or equal to, the min. viewers... be GREEN... otherwise, be RED.
                    }).setColor(shouldRespondToEvent && logObj.viewers >= logObj.trigger ? 'Green' : 'Red'),
                ],
            })
            .catch(_catch);

        if (!m || !m.id) {
            logger.sysDebug.error('DiscordWebhook failed to send message.');
        }
        return;
    },
} as Event;
