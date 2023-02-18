import { IJTTwitchClient } from "../utils/auth-provider";

export default {
    name: 'part',
    once: false,

    run: (channel: string, username: string, self: boolean, client: IJTTwitchClient) => {
        if (!self)
            return;

        console.info('Left', channel)
    }
}