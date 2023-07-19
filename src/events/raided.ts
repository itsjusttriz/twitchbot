import { RaidUserstate } from "tmi.js";
import { dehashChannel } from "../helper/dehash-channels";
import { Event } from "../utils/interfaces/Event";
import { addChannelEvent, getChannelEvent } from "../utils/sqlite";
import { LogPrefixes, logger as _logger } from "../utils/Logger";

const logger = {
    db: _logger.setPrefix(LogPrefixes.DATABASE),
    event: _logger.setPrefix(LogPrefixes.EVENTS),
    normal: _logger.setPrefix(LogPrefixes.DEBUG_MODE)
}

const _catch = (e: any) => {
    logger.normal.error(e);
    return;
}

const parseVars = async (channel: string, username: string, viewers: number, message: string) => {
    return message
        .replaceAll('{channel}', channel)
        .replaceAll('{username}', username)
        .replaceAll('{viewercount}', viewers.toString())
}

const noEventFallback = async (hook: any, channel: string) => {
    if (hook) {
        const m = await hook.send({
            username: `Twitch Raid Event - ${channel}`,
            content: `No event:raided config found for channel:${channel}`
        }).catch(_catch);

        if (!m || !m.id) {
            logger.normal.error("DiscordWebhook failed to send message.")
        }
    }

    await addChannelEvent(
        channel,
        'raided'
    ).then(() => {
        logger.db.success(`Added DiscordWebhook for channel (${channel})`);
    }).catch(e => {
        logger.db.error(e);
        return;
    });
}

export const event = {
    name: 'raided',
    once: false,
    run: async (client, channel: string, username: string, viewers: number, tags: RaidUserstate) => {
        const chan = dehashChannel(channel);
        const event = await getChannelEvent(chan, 'raided').catch(e => {
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
        if (isDisabled)
            shouldRespondToEvent = false;

        if (viewers < parseInt(event.trigger))
            shouldRespondToEvent = false;

        const response = (await parseVars(chan, username, viewers, event.message)).split('\\n');

        for (const line of response) {
            if (!shouldRespondToEvent)
                break;
            else
                await client.chat.say(chan, line).catch(e => {
                    logger.normal.error(`Failed to send message in channel (${chan}): "${line}"`)
                });
        }

        if (!hook)
            return;

        const logObj = {
            channel: chan,
            raider: username,
            isDisabled,
            viewers,
            trigger: parseInt(event.trigger),
            response
        };
        const m = await hook.send({
            username: `Twitch Raid Event - ${channel}`,
            content: `\`\`\`json\n${JSON.stringify(logObj, null, 4)}\n\`\`\``
        }).catch(_catch);

        if (!m || !m.id) {
            logger.normal.error("DiscordWebhook failed to send message.");
        }
        return;
    }
} as Event;