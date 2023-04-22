import { ITime } from "@itsjusttriz/utils";
import { updateStoredChannels } from "../helper/update-stored-channels";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";
import { colors, logger } from "../utils/logger";

export const event = {
    name: 'part',
    once: false,

    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        if (client.settings.debug)
            client.chat.say('itsjusttriz', `Left ${channel}`);
        logger.info(`${colors.RESET}[System/Events]`, `Left ${channel}`);

        if (!client.settings.debug)
            await updateStoredChannels(channel.replace('#', ''), 'REMOVE').catch(e => {
                logger.error('[System/Events] Failed to run updateStoredChannels() of type "REMOVE":', e);
            })
        return;
    }
} as Event;