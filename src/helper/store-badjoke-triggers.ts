import { ITime } from "@itsjusttriz/utils";
import { MessageOptions } from "../utils/MessageOptions";
import { logger } from "../utils/Logger";

const LISTENER_PREFIX = '[Listener/BadJokesHandler]';
const FOURTY_SEVEN_USER_ID = '26797038';

const storeBadJokeTriggers = async (opts: MessageOptions, map: Map<string, boolean>) => {
    const roomId = opts.tags["room-id"];
    if (!roomId) {
        logger.setPrefix(LISTENER_PREFIX).error('Channel ID not stored. Escaping...');
        return;
    }

    const isHandled = map.has(roomId);
    if (isHandled) {
        logger.setPrefix(LISTENER_PREFIX).info('Channel ID already stored. Escaping...');
        return;
    }

    map.set(roomId, true);
    await ITime.wait(3000).then(() => {
        map.delete(roomId);
        logger.setPrefix(LISTENER_PREFIX).info(`Attempted to remove "${roomId}" from channel-map.`);
    });
}

export const handleBadJokes = async (opts: MessageOptions, map: Map<string, boolean>) => {
    const triggers = ['badjoke'];
    const is47y = opts.tags["user-id"] === FOURTY_SEVEN_USER_ID;

    if (triggers.includes(opts.command)) {
        logger.setPrefix(LISTENER_PREFIX).info(`!${opts.command} was triggered in ${opts.channel}.`);
        await storeBadJokeTriggers(opts, map);
        return;
    }

    if (is47y) {
        if (!map.has(opts.tags["room-id"])) {
            logger.setPrefix(LISTENER_PREFIX).error('Channel ID not stored. Escaping...');
            return;
        }

        await ITime.wait(2000);
        await opts.chatClient.say(opts.channel, 'NotLikeThis');
        return;
    }
    return;
}