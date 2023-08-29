import { EmbedBuilder } from 'discord.js';
import { RaidUserstate } from 'tmi.js';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';
import { addChannelEvent, getChannelEvent } from '../utils/sqlite';

export const event = {
    name: 'raided',
    once: false,
    run: async (client, channel: string, username: string, viewers: number, tags: RaidUserstate) => {
        const chan = _.dehashChannel(channel);
        const event = await getChannelEvent(chan, 'raided').catch((e) => {
            logger.db.error(e);
            return;
        });

        let shouldRespondToEvent = true;

        const hook = client.discordWebhooks.get('ijtdev');

        if (!event) {
            try {
                await _.noEventFallback('Raid', hook, chan);
                await addChannelEvent(channel, 'raided');
                logger.db.success(`Added DiscordWebhookMessage for channel (${channel}) for event (Raid)`);
            } catch (e) {
                logger.db.error('EVENT/RAID -> Something went wrong during noEventFallback() ' + e);
            }
            shouldRespondToEvent = false;
        }

        const isDisabled = Boolean(event.disabled);
        if (isDisabled) shouldRespondToEvent = false;

        if (viewers < parseInt(event.trigger)) shouldRespondToEvent = false;

        const response = (await _.parseCustomVarsInMessage(event.message, { channel, username, viewers })).split('\\n');

        for (const line of response) {
            if (!shouldRespondToEvent) break;
            if (client.settings.isMuted) break;
            await client.chat.say(chan, line).catch((e) => {
                logger.sysDebug.error(`Failed to send message in channel (${chan}): "${line}"`);
            });
        }

        if (!hook) return;

        const embed = new EmbedBuilder()
            .setTitle(`Twitch Raid Event - ${channel}`)
            .setDescription(
                [
                    `This event response **${shouldRespondToEvent ? 'WAS' : 'WAS NOT'}** triggered.\n`,
                    ...Object.entries({
                        Raider: username,
                        isDisabled: `${isDisabled}`.toUpperCase(),
                        Viewers: viewers,
                        'Min. Viewers': event.trigger,
                    }).map(([key, value]) => {
                        return `**${key}:** \` ${value} \``;
                    }),

                    // This one is seperate due to the formatting being different.
                    `**Response(s):** \`\`\`\n${response.join('\n')}\n\`\`\``,
                ].join('\n')
            )
            // If the response SHOULD be sent & current viewers is above, or equal to, the min. viewers... be GREEN... otherwise, be RED.
            .setColor(shouldRespondToEvent && viewers >= parseInt(event.trigger) ? 'Green' : 'Red');

        try {
            await hook.send({
                username: `TwitchBot Log`,
                embeds: [embed],
            });
        } catch (error) {
            logger.sysDebug.error('DiscordWebhook failed to send message.');
        }

        return;
    },
} as Event;
