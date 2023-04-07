import { ITime } from "@itsjusttriz/utils";
import { updateStoredChannels } from "../helper/update-stored-channels";
import { IJTTwitchClient } from "../controllers/IJTClient";
import { Event } from "../utils/interfaces/Event";

export const event = {
    name: 'join',
    once: false,

    run: async (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        if (client.settings.debug)
            client.chat.say('itsjusttriz', `Joined ${channel}`);
        console.info(ITime.formatNow('short'), `| Joined ${channel}`);

        if (!client.settings.debug)
            await updateStoredChannels(channel.replace('#', ''), 'ADD').catch(e => {
                console.warn(`[Error] Failed to run updateStoredChannels()#ADD: ` + e);
            })
        return;
    }
} as Event;