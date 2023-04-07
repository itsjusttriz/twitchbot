import { ITime } from "@itsjusttriz/utils";
import { updateStoredChannels } from "../helper/update-stored-channels";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";

export const event = {
    name: 'part',
    once: false,

    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        // (await client.getChatClient()).say('itsjusttriz', `Joined ${channel}`);
        console.info(ITime.formatNow('short'), `| Joined ${channel}`);

        await updateStoredChannels(channel.replace('#', ''), 'REMOVE').catch(e => {
            console.warn(`[Error] Failed to run updateStoredChannels()#REMOVE: ` + e);
        });
        return;
    }
} as Event;